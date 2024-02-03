import { Component, OnInit, ElementRef } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;
declare var idensic: any;
@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {
  public isLoading:boolean = true;
  kycKey: any = '';
  profileData: any = {};
  // otp: any = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
  // ethWallet: any = '';
  // editEth: any = false

  dateOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd'
  }
  kycUserForm: FormGroup;
  countryListArr: any = [];
  allCountryListArr: any = [];
  nationalityListArr: any = [];
  kycData: any = {};
  constructor(private service: MainService, private elementRef: ElementRef, private fb: FormBuilder) {
  	window.scrollTo(0, 0)    
  }
  ngOnInit() {
    let currDate = new Date()
    currDate.setDate(currDate.getDate() + 1)
    this.dateOptions.disableSince = { year: new Date().getFullYear(), month: (currDate.getMonth() + 1), day: currDate.getDate() }
    this.countryListArr = this.service.countryList
    this.allCountryListArr = this.service.allCountryList
    this.nationalityListArr = this.service.nationalityList

    this.getProfileApi()
    
    // this.kycApi()
    this.kycUserForm =  this.fb.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/)])],
      // 'email': ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)])],
      'phoneCode': [null, Validators.required],
      'country': [null, Validators.required],
      'nationality': [null, Validators.required],
      'mobile_number': ['', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]{4,15}$/)])],
      'dob': [null, Validators.required]
    })
    this.getKycDataApi()
   
  }
  
  updateProfile() {
    // console.log('kyc update => ' )
    // console.log(JSON.stringify(this.profileForm.value))
    let updateData = window['kyc_result']
    this.isLoading = true;
    // this.service.spinnerShow()
    this.service.postApi(`kyc-data`, updateData, 1).subscribe(response => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if(response.status == 200) {
        // this.service.toastrSucc(response.body.message)
        this.getProfileApi()
      } else
        this.service.toastrErr(`Something went wrong`)
    }, error => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }

  newFun() {
    // console.log('dasjhgdjgsdkasl')
  }
  
  // **************** Get Profile (User detail) Api ************************* 
  getProfileApi() {
    this.isLoading = true;
    // this.service.spinnerShow()
  	this.service.getApi(`profile`, 1).subscribe(response => {
      this.isLoading = false;
      // this.service.spinnerHide()
  		if(response.status == 200) {
  			this.profileData = response.body.data
        // if(this.profileData.eth_address) {
        //   this.ethWallet = this.profileData.eth_address
        //   this.editEth = true
        // } 
        if(this.profileData.kyc_doc_information != 'ACCEPT' && this.profileData.kyc_doc_information != 'MANUAL_REVIEW') {

          /** Commented Part of Identity Mind KYC */

          /* var a = document.createElement('script');
          var m = document.getElementsByTagName('script')[0];
          a.src= 'https://cd1st.identitymind.com/idm.min.js';
          m.parentNode.insertBefore(a,m)

          var self = this;
          this.service.kycInterval  = setInterval(() => {
            if(localStorage.getItem('kyc_result') != null) {
              self.updateProfile()
              clearInterval(this.service.kycInterval)
              localStorage.removeItem('kyc_result')
            }
          }, 2000) */

          /** Commented Part of Identity Mind KYC */

        }
        // this.updateProfile('da')
  		} else {
  			this.service.toastrErr(`Something went wrong`)
  		}
  	}, error => {
      this.isLoading = false;
      // this.service.spinnerHide()
  		if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
  	})
  }
  // **************** End Get Profile (User detail) Api ********************* 
  /*
  getKycToken() {
    this.service.getApi(`get_kyc_key`, 1).subscribe(response => {
      console.log(response)
      if(response.status == 200) {
        this.kycKey = response.body.data;
        let array = this.kycKey.split('.')
        console.log(array)
        let header = (atob(array[0]));
        console.log(header)
        let res = JSON.parse(atob(array[1]));
        console.log(res)
        let signature = array[2];
        // console.log(atob(array[2]))
        // alert("Result from Identitymind: " + res.kyc_result);
        
          this.kycApi()  
       
        
      } else {

      }
    }, error => {
      console.log(error)
    })
  }
  */
  // ***************** Send OTP API(for email verify) *******************
  verifyEmail() {
    if(!this.profileData.is_email_verified) {
      // console.log('not verified')
     this.isLoading = true;
    // this.service.spinnerShow()
      this.service.getApi(`resend-verify-email`, 1).subscribe(response => {
        this.isLoading = false;
        // this.service.spinnerHide()
        if(response.status == 200) {
          // this.otp = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
          $(`#verify_email`).modal(`show`)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        this.isLoading = false;
        // this.service.spinnerHide()
        if(error.status == 400) {
          this.service.toastrErr(error.error.message)
        } else {
          this.service.toastrErr('Something went wrong')
        }
        
      })
      
      // $("#email_verify_modal").modal({
      //       backdrop: 'static'
      //   });
    } else {
      // console.log('verified')
    }
  }
  // ***************** End Send OTP API(for email verify) ****************

  /* changeFocus(otp, val, event) {
    if(otp.length == 1) {
      if(val && val != 'complete') {
        $(`#${val}`).focus()
      }      
    }    
  } */
 /*  remove(otp, val, event) {
    if(!otp) {
      if(event.keyCode == 8) {
        if(val == `complete`) {
          this.otp.five = ''
          $(`#emailFifthInput`).focus()
        }
        else if(val == `emailSixthInput`) {
          this.otp.four = ''
          $(`#emailFourthInput`).focus()
        }
        else if(val == `emailFifthInput`) {
          this.otp.three = ''
          $(`#emailThirdInput`).focus()
        }
        else if(val == `emailFourthInput`) {
          this.otp.two = ''
          $(`#emailSecondInput`).focus()
        }
        else if(val == `emailThirdInput`) {
          this.otp.one = ''
          $(`#emailFirstInput`).focus()
        }
      }
    }
  } */

  // **************** Submit OTP API(For email verify) **************************
  /* submitotp() {
    
   this.isLoading = true;
    let otpData = { "otp": Object.values(this.otp).join('') }
    this.service.postApi(`otp-verify`, otpData, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        $(`#email_verify_modal`).modal('hide')
        this.getProfileApi()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
        this.isLoading = false;
      if(error.status == 404 || error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  } */
  // **************** End Submit OTP API(For email verify) *********************

  kycApi() {

      // var _idm = {
      //     container_id: "idm-container",
      //     plugin_token: this.kycKey,
      //     required_address_country_list: ["US","GB","CA","ZA","SE","DK"] ,
      //     required_id_country_list:['US::^(?!666|000|9\\d{2})\\d{3}[- ]{0,1}(?!00)\\d{2}[- ]{0,1}(?!0{4})\\d{4}$'],
      //     country_blacklist: ['AR','PR'],
      //     form_labels:{
      //       "first_name":"Custom First Name label",
      //       "email": "Custom email Label"
      //     },
      //     accept_message:"You were accepted, wohoo",
      //     deny_message:"ops, there was an error, please contact us.<a href='mailto:c@ex.com'>Contact Email</a>",
      //     existing_kyc_message: "You have already registered.",
      //     on_response: function(jwtresponse){
      //         console.log('response')
      //         //handle response jwtresponse here
      //         //A simple example below:
      //         const array = jwtresponse.split('.');
      //         const header = JSON.parse(atob(array[0]));
      //         const response = JSON.parse(atob(array[1]));
      //         const signature = array[2];
      //         alert("Result from Identitymind: " + response.kyc_result);

      //     }
      // };
      
        
      
     
  }
  /* saveWallet() {
    let updateData = {
      "eth_address": this.ethWallet
    }
    this.service.spinnerShow()
    this.service.postApi(`profile`, updateData, 1).subscribe(response => {
      this.service.spinnerHide()
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        this.getProfileApi()
      } else
        this.service.toastrErr(`Something went wrong`)
    }, error => {
      this.service.spinnerHide()
      this.service.toastrErr(`Something went wrong`)
    })
  } */


  get kForm() {
    return this.kycUserForm.controls;
  }


  getKycDataApi() {
    this.isLoading = true;
    this.service.getApi(`get-whitelist-data`, 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        if(response.body.data) {
          this.kycData = response.body.data
          this.kycUserForm.patchValue({
            firstName: this.kycData.first_name || '',
            lastName: this.kycData.last_name || '',
            country: this.kycData.country || '',
            nationality: this.kycData.nationality || '',
            phoneCode: this.kycData.phone ? this.kycData.phone.split(/-/)[0] : '',
            mobile_number: this.kycData.phone ? this.kycData.phone.split(/-/)[1] : '',
            
          })
          if(this.kycData.dob) {
            this.kycUserForm.patchValue({
              dob: {
                formatted: this.kycData.dob,
                date: {
                  year: Number(this.kycData.dob.split('-')[0]),
                  month: Number(this.kycData.dob.split('-')[1]),
                  day: Number(this.kycData.dob.split('-')[2])
                }
              }
            })
          }
          this.kycUserForm.disable()
          // this.kycData.verify_stage = 'UNVERIFIED'
        }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false
      this.service.toastrErr(`Something went wrong`)
    })
  }

  editKycForm() {
    this.kycUserForm.enable()
  }

  saveDocuments() {
    console.log(this.kycUserForm.value)
    let formVal = this.kycUserForm.value
    let data = {
      first_name: formVal.firstName,
      last_name: formVal.lastName,
      // email: formVal.email,
      country: formVal.country,
      nationality: formVal.nationality,
      phone: formVal.phoneCode + '-' + formVal.mobile_number,
      dob: formVal.dob.formatted
    }
    this.isLoading = true
    this.service.postApi(`whitelist-user`, data, 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
       console.log(JSON.stringify(response))
        this.kycUserForm.disable()
        this.kycIframeLoad(response.body.token)
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
    $(`#kyc_iframe_modal`).modal('show')
    $('#idensic').html('')
    // $('html, body').animate({
    //     scrollTop: $("#idensic").offset().top
    // }, 2000);
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
  updateAndScroll() {
    this.isLoading = true;
    this.service.getApi(`kyc-tokens`, 1).subscribe(response => {
      this.isLoading = false;
      this.kycIframeLoad(response.body.token)
    },  error => {
      this.isLoading = false;
    })
  }

}
