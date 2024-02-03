import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { Router } from '../../../../node_modules/@angular/router';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
declare var $: any;
declare var idensic: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  unameSaved: boolean = false;
  public isLoading: boolean = true;
  profileData: any = {};
  countryListArr: any = [];
  profileForm: FormGroup;
  // stakingData = false;
  ethRead: any = false;
  btcRead: any = false;
  stakeData: any = {};
  stakeTransactionData: any = { admin_stake_address: null };
  public inactive: boolean = true;
  public inactives: boolean = true;
  public inactivebitcoin: boolean = true;
  kycData: any = {};
  ranking;
  ether: any;
  btc: any;
  stakes: boolean;
  dateOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd'
  }
  allCountryListArr: any=[];
  nationalityListArr: any=[];
  // qrImage: any;
  gAuthqrImage: any;
  enableGOtp: any = '';
  // userName: any = ''
  applicationData: any = '';
  inviteForm: FormGroup;
  stellarForm: FormGroup;
  constructor(private service: MainService, private fb: FormBuilder, private router: Router) {
    window.scrollTo(0, 0)
  }
  ngOnInit() {
    // this.profileForm = this.fb.group({
    //   'firstName': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/)])],
    //   'lastName': ['', Validators.compose([Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/)])],
    //   'email': ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)])],
    //   'dob':['',Validators.compose([Validators.required])],
    //   'country': ['', Validators.required],
    //   'nationality': ['', Validators.required],
    //   'penalty': '',
    //   'phoneCode': ['', Validators.required],
    //   'mobile_number': ['', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]{4,15}$/)])],
    //   'eth': '',
    //   'stakeaddress' : '',
    //   'userName': ''
    //   // 'tokenquantity' : [ '', Validators.required ]
    // })
    this.profileForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/)]),
      'lastName': new FormControl('', [Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/),Validators.required]),
      //'email': new FormControl('', [Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)]),
      'dob':new FormControl('',[Validators.required]),
      'country': new FormControl(null,Validators.required),
      'nationality':new FormControl(null,Validators.required),
      'phoneCode':new FormControl(null,Validators.required),
      'mobile_number': new FormControl('',[Validators.required, Validators.pattern(/^[1-9][0-9]{4,15}$/)]),//['', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]{4,15}$/)])],
      'eth': new FormControl(''),
      'stakeaddress' :new FormControl (''),
      'user_name': new FormControl(''),
      'penalty' : new FormControl('')
      // 'tokenquantity' : [ '', Validators.required ]
    })
    //this.countryListApi();
    this.inviteForm  = this.fb.group({
      'email': [ '', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)]) ]
    })

    this.stellarForm = this.fb.group({
      'stellar': [ '', Validators.required ]
    })
    this.stellarForm.controls['stellar'].disable()
    let currDate = new Date()
    currDate.setDate(currDate.getDate() + 1)
    this.dateOptions.disableSince = { year: new Date().getFullYear(), month: (currDate.getMonth() + 1), day: currDate.getDate() }
    this.countryListArr = this.service.countryList
    this.allCountryListArr = this.service.allCountryList
    /* this.allCountryListArr = this.allCountryListArr.filter((thing, index, self) =>
				index === self.findIndex((t) => (
					t.id === thing.id 
				))
			)
			this.allCountryListArr = this.allCountryListArr.sort((a, b) =>  {
				return a.code - b.code;
			}); */
    this.nationalityListArr = this.service.nationalityList
    this.getProfileApi();
    this.getSellingApi();
   
    // this.countryListApi();
   
  }
  public stake = {
    "stake_data": {
      "stake_address": ""
    }
  }
  // ************* Get Profile (User Detail) Api **************
  getProfileApi() {
    // 
    this.isLoading = true;
    // this.service.spinnerShow()
    this.service.getApi(`profile`, 1).subscribe(response => {
      console.log('response =>',response);
      // 
      this.isLoading = false;
      // this.service.spinnerHide()
      if (response.status == 200) {
        let profileData = response.body.data; 
        this.kycData  = response.body.kyc_data
       // console.log("Profile Data--->>  ",response.body);
        this.ether = profileData.eth_address;
        this.btc = profileData.btc_address;
        this.ranking = response.body.ranking;
        var stakeData = response.body.stake_data;
        this.stakes = ((stakeData.stake_address == null)||(stakeData.approved == false))?true:false
        if (profileData.is_institutional) {
          this.router.navigate(['/institutional/profile'])
        } else {
          this.stakeData = response.body.stake_data;
          this.stake.stake_data.stake_address = response.body.stake_data.stake_address // Stake Address fill value
          this.eth.eth_address = response.body.data.eth_address // ETH Address fill value
          this.bitcoin.btc_address = response.body.data.btc_address// bitcoin Address fill value
          this.stakeTransactionData = response.body.stake_transact;
          var s = profileData.mobile_number;
          if (s) {
            var fields = s.split(/-/);
            var phoneCode = fields[0];
            var mobile_number = fields[1];
          }

          this.profileForm.patchValue({
            firstName: this.kycData.first_name || '',
            lastName: this.kycData.last_name || '',
            email: profileData.email,
            eth: profileData.eth_address,
            bitcoin: profileData.btc_address,
            penalty: profileData.penalty,
            mobile_number: mobile_number || '',
            phoneCode: phoneCode || null,
            userName: profileData.user_name || ''
            // stakeaddress : this.stakeData.stake_address || '',
            // tokenquantity : this.stakeData.token_quantity
          })
          this.profileData = response.body.data
          this.ethRead = this.profileData.eth_address ? true : false
          this.btcRead = this.profileData.btc_address ? true : false
          this.kycData = response.body.kyc_data
          if(profileData.steller_address) {
            this.stellarForm.patchValue({
              stellar: profileData.steller_address || ''
            })
          }
          
          // this.userName = this.profileData.user_name || ''
          // this.kycData.verify_stage = 'UNVERIFIED'
          // this.kycData.manual_approve = false
        }

      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }

    })
  }
  public eth = {
    "eth_address": ""
  }
  public bitcoin = {
    "btc_address": ""
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
    // this.service.spinnerShow()
    this.service.postApi(`profile`, updateData, 1).subscribe(response => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if (response.status == 200) {
        this.service.toastrSucc(response.body.message)
        this.getProfileApi()
      } else
        this.service.toastrErr(`Something went wrong`)
    }, error => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }

    })
  }
  // ***************** Save User Name APi ************************* //
  saveUserName() {
    console.log(this.profileForm.value.user_name)
    if(this.profileForm.value.user_name) {
      let data = {
        user_name: this.profileForm.value.user_name
      }
      this.isLoading = true
      this.service.postApi(`check-user-name`, data, 1).subscribe(response => {
        this.isLoading = false;
        if (response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.getProfileApi();
          this.unameSaved = true;
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        this.isLoading = false;
        if (error.status == 400) {
          this.service.toastrErr(error.error.message)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      })
    }

  }
  // ***************** End Save User Name APi ************************* //
  // ETH Address
  changeAddress() {
    if (this.eth.eth_address) {
      this.eth = {
        "eth_address": this.eth.eth_address
      }
      this.isLoading = true;
      // this.service.spinnerShow()
      this.service.postApi(`profile`, this.eth, 1).subscribe(response => {
        this.isLoading = false;
        // this.service.spinnerHide()
        if (response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.getProfileApi()
          this.inactives = true;
        } else
          this.service.toastrErr(`Something went wrong`)
      }, error => {
        this.isLoading = false;
        // this.service.spinnerHide()
        if (error.status == 400) {
          this.service.toastrErr(error.error.message)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      })
    }

  }
  changebitcoinAddress() {
    if (this.bitcoin.btc_address) {
      this.bitcoin = {
        "btc_address": this.bitcoin.btc_address
      }
      this.isLoading = true;
      this.service.postApi(`profile`, this.bitcoin, 1).subscribe(response => {
        this.isLoading = false;
        if (response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.getProfileApi()
          this.inactivebitcoin = true;
        } else
          this.service.toastrErr(`Something went wrong`)
      }, error => {
        this.isLoading = false;
        if (error.status == 400) {
          this.service.toastrErr(error.error.message)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      })
    }

  }
  // stake address
  saveStakingAddress() {
    // if(this.profileForm.value.stakeaddress) {
    this.stake = {
      "stake_data": {
        "stake_address": this.stake.stake_data.stake_address,
        // "stake_address": this.profileForm.value.stakeaddress,
      }
    }
    // this.service.spinnerShow()
    this.isLoading = true;

    this.service.postApi(`profile`, this.stake, 1).subscribe(response => {
      console.log(this.stake)
      this.isLoading = false;
      // this.service.spinnerHide()
      if (response.status == 200) {
        this.service.toastrSucc(response.body.message)
        this.getProfileApi();
        this.inactive = true;
        // this.stakingData = true;
        response.body.popup ? $(`#stakeAddress`).modal(`show`) : ''

      } else
        this.service.toastrErr(`Something went wrong`)
    }, error => {
      // this.service.spinnerHide()
      this.isLoading = false;
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
    // }

  }
  // ************** End Update Profile Api ********************

  // ************** Enable Auth API (OTP/Google) ***************
  changeAuth(val) {
    let authData;
    let url;
    if (val === `google`) {
      if(this.profileData.otp_auth) {
        this.service.toastrErr(`You can't enable 2 factor authentication more than one`)
        return;
      }
      authData = this.profileData.google_auth ? { "google_auth": "False" } : { "google_auth": "True" }
      url = `google-auth`;
    } else if (val === `otp`) {
      if(this.profileData.google_auth) {
        this.service.toastrErr(`You can't enable 2 factor authentication more than one`)
        return;
      }
      authData = this.profileData.otp_auth ? { "otp_auth": "False" } : { "otp_auth": "True" }
      url = `otp-auth`;
    }
    this.isLoading = true;
    // this.service.spinnerShow()
    this.service.postApi(url, authData, 1).subscribe(response => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if (response.status == 200) {
        if (val === `google`) {
          if(!this.profileData.google_auth) {
            this.enableGOtp = ''
            this.gAuthqrImage = response.body.Qr
            $(`#google_auth_qr`).modal({backdrop: 'static'})
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
      // this.service.spinnerHide()
      if (error.status == 400) {
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
        $(`#google_auth_qr`).modal('hide')
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
  countryListApi() {
    this.service.getCountriesJson().subscribe(response => {
      this.countryListArr = response.countries
      console.log("Country Data---->> > ",this.countryListArr);
    }, error => {
      this.service.toastrErr(`Something went wrong`)
    })
  }
  // ************ End Country List JSON ********************

  changeStatus() {
    this.inactive = false
  }
  changeEditStatus() {
    this.inactives = false
  }
  changeEditStatusBitcoin() {
    this.inactivebitcoin = false;
  }

  goToEther(txnId, symbol = '') {
    this.service.openEtherPage(txnId, symbol)
  }
  copyToClipboard(text) {
    this.service.copyToClipboard(text);
  }

  verifyEmail() {
    this.isLoading = true;
    this.service.getApi(`resend-verify-email`, 1).subscribe(response => {
      this.isLoading = false;
      if (response.status == 200) {
        $(`#verify_email_profile`).modal(`show`)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr('Something went wrong')
      }
    })
  }
  /*********************** Save User Profile Detail *************/
  saveDocuments() {
    console.log(this.profileForm.value)
    let formVal = this.profileForm.value
    let data = {
      first_name: formVal.firstName,
      last_name: formVal.lastName,
      // email: formVal.email,
      country: formVal.country,
      nationality: formVal.nationality,
      phone: formVal.phoneCode + '-' + formVal.mobile_number,
      dob: formVal.dob.formatted
    }
    console.log("ApiData--->>  ",JSON.stringify(data));
    this.isLoading = true
    this.service.postApi(`whitelist-user`, data, 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        // console.log(JSON.stringify(response))
        // this.profileForm.reset()
        this.profileForm.reset()
        this.getProfileApi()
        // this.profileForm.disable()
        // this.kycIframeLoad(response.body.token)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      
      this.isLoading = false
      if(error.status == 400) 
        this.service.toastrErr(error.error.message)
      else 
        this.service.toastrErr(`Something went wrong`)
    })
  }
  kycIframeLoad(token) {
    $('#idensic').html('')
    $('html, body').animate({
        scrollTop: $("#idensic").offset().top
    }, 2000);
    var id = idensic.init(
      // selector of an IFrame container (see above)
      '#idensic',
      // configuration object (see preparation steps)
      {
          accessToken: token,
          applicantDataPage: {
              "enabled": true,
              "fields": [
                  {
                   "name": "firstName",
                   "required": true
                  },
                  {
                   "name": "lastName",
                   "required": true
                  },
                  {
                   "name": "email",
                   "required": false
                  }
              ]
          },
          // steps to require:
          // identity proof (passport, id card or driving license) and a selfie
          requiredDocuments: "IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE",
      },
      // function for the IFrame callbacks
       function (messageType, payload) {
          // just logging the incoming messages
          console.log('[IDENSIC DEMO] Idensic message:', messageType, payload);
       }
    )
  }
  // ********************** Invite Friend API ****************** //
  
  inviteFriend() {
    let data = {
      email: this.inviteForm.value.email
    }
    this.isLoading = true;
    this.service.postApi(`invite-friend`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        this.inviteForm.reset()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 400) 
        this.service.toastrErr(error.error.message)
      else
        this.service.toastrErr(`Something went wrong`)
    })
  }
  // ********************** End Invite Friend API ****************** //
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

  changeStellarAddress(disabled) {
    if(disabled) {
      this.stellarForm.controls['stellar'].enable()
    } else {
      let address = {
        "steller_address" : this.stellarForm.value.stellar
      }
      this.isLoading = true;
      this.service.postApi(`profile`, address, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.stellarForm.controls['stellar'].disable()
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
  }
}
