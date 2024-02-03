import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../../../providers/mainService.service';

declare var $: any;
@Component({
  selector: 'app-in-profile',
  templateUrl: './in-profile.component.html',
  styleUrls: ['./in-profile.component.css']
})
export class InProfileComponent implements OnInit {
  public isLoading:boolean = true;
  profileForm: FormGroup;
  countryListArr: any = [];
  profileData: any = {};
  kycData: any = {}
  gAuthqrImage: any;
  enableGOtp: any = '';
  applicationData: any = '';
  constructor(private fb: FormBuilder, private service: MainService) { }

  async ngOnInit() {
    this.profileForm = this.fb.group({
      'firstName': [ '', Validators.compose([ Validators.required, Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/) ]) ],
      'lastName': [ '', Validators.compose([ Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/) ]) ],
      'email': [ '', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)]) ],
      'penalty': '',
      'phoneCode': [ '', Validators.required ],
      'mobile_number': [ '', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]{4,15}$/)]) ],
      'userName': ''
      // 'eth': '',
      // 'stakeaddress' : '',
      // 'tokenquantity' : [ '', Validators.required ]
    })
    // this.countryListApi();
    this.countryListArr = this.service.allCountryList;
    this.getProfileApi();
    this.getSellingApi()
    
  }
  // ************ End Enable Auth API (OTP/Google) ************
  countryListApi() {
    return new Promise((resolve, reject) => {
      this.service.getCountriesJson().subscribe(response => {
        this.countryListArr = response.countries
        resolve(true)
      }, error => {
        this.service.toastrErr(`Something went wrong`)
      })
    })
    
  }
  // ************ End Country List JSON ********************

  // ************* Get Profile (User Detail) Api **************
  getProfileApi() {
  	this.isLoading = true;
  	this.service.getApi(`profile`, 1).subscribe(response => {
  		this.isLoading = false;
  		if(response.status == 200) {
        let profileData = response.body.data;
        // this.stakeData = response.body.stake_data;
        // this.stakeTransactionData = response.body.stake_transact;
        var s =  profileData.mobile_number;
        if(s) {
          var fields = s.split(/-/);
          var phoneCode = fields[0];
          var mobile_number = fields[1];
        }
        
        this.profileForm.patchValue({
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          email: profileData.email,
          // eth: profileData.eth_address,
          penalty: profileData.penalty,
          mobile_number : mobile_number|| '',
          phoneCode : phoneCode || '',
          userName: profileData.user_name
          // stakeaddress : this.stakeData.stake_address,
          // tokenquantity : this.stakeData.token_quantity
        })
        this.profileData =  response.body.data
        
        // this.ethRead = this.profileData.eth_address ?  true : false
        this.kycData  = response.body.kyc_data
  		} else {
  			this.service.toastrErr(`Something went wrong`)
  		}
  	}, error => {
      this.isLoading = false;
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
  		
  	})
  }
  // ******** End Get Profile (User Detail) Api ***************
  // **************** Update Profile Api **********************
  updateProfile() {
    let updateData = {
      "first_name": this.profileForm.value.firstName,
      "last_name": this.profileForm.value.lastName,
      "email": this.profileForm.value.email,
      "mobile_number": this.profileForm.value.phoneCode + '-' + this.profileForm.value.mobile_number,
    }
      // updateData['eth_address'] = this.profileForm.value.eth
      this.isLoading = true;
    this.service.postApi(`profile`, updateData, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        this.getProfileApi()
      } else
        this.service.toastrErr(`Something went wrong`)
    }, error => {
      this.isLoading = false;
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
      
    })
  }
  // ***************** End Update Profile *****************
  // ***************** Save User Name APi ************************* //
  saveUserName() {
    console.log(this.profileForm.value.userName)
    if(this.profileForm.value.userName) {
      let data = {
        user_name: this.profileForm.value.userName
      }
      this.isLoading = true
      this.service.postApi(`check-user-name`, data, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.getProfileApi()
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        this.isLoading = false;
        if(error.status == 400) {
          this.service.toastrErr(error.error.message)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      })
    }
    
  }
  // ***************** End Save User Name APi ************************* //
  get form() {
    return this.profileForm.controls;
  }
  // ************** Enable Auth API (OTP/Google) ***************
  changeAuth(val) {
    let authData;
    let url;
    if(val === `google`) {
      authData = this.profileData.google_auth ? { "google_auth": "False"} : { "google_auth": "True" }
      url = `google-auth`;
    } else if(val === `otp`) {
      authData = this.profileData.otp_auth ? { "otp_auth": "False"} : { "otp_auth": "True" }
      url = `otp-auth`;
    }
    this.isLoading = true;
    this.service.postApi(url, authData, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        if(val === `google`) {
          if(!this.profileData.google_auth) {
            this.enableGOtp = ''
            this.gAuthqrImage = response.body.Qr
            $(`#in_google_auth_qr`).modal({backdrop: 'static'})
            return;
          }
        }
        this.service.toastrSucc(response.body.message)
        this.getProfileApi()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }
  // ************ End Enable Auth API (OTP/Google) ************
  enableGOtpSubmit() {
    if(!this.enableGOtp.trim()) {
      return;
    }
    let data = {
      totp: this.enableGOtp.trim()
    }
    this.isLoading = true;
    this.service.postApi(`enable-google-auth`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        $(`#in_google_auth_qr`).modal('hide')
        this.getProfileApi()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
      
    })
  }
  getSellingApi() {
    this.isLoading = true;
    this.service.getApi('get-application', 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        // this.applicationData = response.body.data
        // this.isInstitutional = response.body.is_institutional
        // console.log('this.applicationData => ', this.applicationData + '==> ', this.applicationData == '')
          this.applicationData = response.body.data          
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false
      this.service.toastrErr(`Something went wrong`)
    })
  }


}
