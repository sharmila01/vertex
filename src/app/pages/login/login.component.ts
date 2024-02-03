import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { Location } from '@angular/common';
// import { filter } from 'rxjs/operator/filter';



declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoading:boolean = false;

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
	isSignin: boolean = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  captchaToken: any = '';
  countryListArr: any = [];
  // otp: any = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
  signupData: any = {};
  profileData: any = {};
  auth: any = ``;
  // loginGOtp: any = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
  loginGOtp: any = ''
  // loginOtp: any = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
  loginOtp: any = "";
  
  constructor(private service: MainService, private router: Router, private fb: FormBuilder, private location: Location, private route: ActivatedRoute) {
  	window.scrollTo(0, 0)
  }

  ngOnInit() {
    // $(`#signup_success`).modal({backdrop: 'static'})
    // console.log(this.service.loginVar)
    this.route.params.subscribe(val => {
      // console.log('params value =>' + val['val'])
      this.service.loginVar = val['val']
      if(val['val'] === `login`) {
        this.isSignin = true;
        $(`#signinTab`).addClass(`active`);
        $(`#signupTab`).removeClass(`active`);
         
      } else if(val[`val`] === `signup`) {
        this.isSignin = false;
        $(`#signupTab`).addClass(`active`);
        $(`#signinTab`).removeClass(`active`);
      }
    });
    // $(`#signinTab`).addClass(`active`);
    // this.countryListApi()
   
     

    this.loginForm = this.fb.group({
      'email': [ '', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)]) ],
      'password': [ '', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\d$@$!%*#?&^\S]*$/)]) ],
      'rememberMe': [ false, Validators.required ]
    })

    this.registerForm = this.fb.group({
      // 'firstName': [ '', Validators.compose([ Validators.required, Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/) ]) ],
      // 'lastName': [ '', Validators.compose([ Validators.minLength(2), Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/) ]) ],
      'email': [ '', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)]) ],
      // 'phoneCode': [ '', Validators.required ],
      // 'phoneNumber': [ '', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]{4,15}$/)]) ],
      'password': [ '', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z\d$@$!%*#?&^\S]*$/)]) ],
      'cnfPassword': [ '', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z\d$@$!%*#?&^\S]*$/)]) ],
      'terms': [ false, Validators.required ]
    })
    if(localStorage.getItem(`loginData`) != null) {
      let lgData = JSON.parse(localStorage.getItem(`loginData`))
      this.loginForm.patchValue({
        'email': lgData.email,
        'password': lgData.password,
        'rememberMe': lgData.rememberMe
      })
    }

    localStorage.setItem('loggedIn','false')
    localStorage.setItem('loggedEmail','')
    // this.loadScript()
  }

  
  toggle(val) {
  	this.isSignin = val;
    if(this.isSignin) {
      this.router.navigate([`vertex`, `login`])
      $(`#signinTab`).addClass(`active`);
      $(`#signupTab`).removeClass(`active`);
      // this.service.loginVar = `login`
    } else {
      this.router.navigate([`vertex`, `signup`])
      $(`#signupTab`).addClass(`active`);
      $(`#signinTab`).removeClass(`active`);
      // this.service.loginVar = `signup`
    }
  }
  // ******************** Login API *************************** 
  login() {
    this.captchaToken = this.captcha.getResponse();
    this.captcha.reset();
    if(this.captchaToken) {
      let loginData = {
        "email": this.loginForm.value.email.trim(),
        "password": this.loginForm.value.password.trim()
      }
      this.isLoading = true;
      // this.service.spinnerShow()
      this.service.postApi(`login`, loginData, 0).subscribe(response => {
        // console.log(JSON.stringify(response))
        // this._ngxZendeskWebwidgetService.show();
        this.isLoading = false;
        // this.service.spinnerHide()
        if(response.status == 200) {
          this.profileData = response.body
          // console.log(this.profileData.data.qr_code)
          this.service.currToken = response.body.token
          if(this.profileData.data.otp_auth && this.profileData.data.google_auth) {
            this.auth = `both`
            // this.loginOtp = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
            this.loginOtp = ''
            // $(`#loginOtpAutheticator`).modal(`show`)
            $(`#loginOtpAutheticator`).modal({backdrop: 'static'})
          } else if(this.profileData.data.otp_auth && !this.profileData.data.google_auth) {
            this.auth = `otp`
            // this.loginOtp = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
            this.loginOtp = ''
            // $(`#loginOtpAutheticator`).modal(`show`)
            $(`#loginOtpAutheticator`).modal({backdrop: 'static'})
          } else if(this.profileData.data.google_auth && !this.profileData.data.otp_auth){
            this.auth = `google`
            // this.loginGOtp = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
            this.loginGOtp = ''
            // $(`#loginGoogleAutheticator`).modal(`show`)
            $(`#loginGoogleAutheticator`).modal({backdrop: 'static'})
          } else {
            this.auth = ``
            this.loginSucc()
          }
          
          
        } else {
          // this._ngxZendeskWebwidgetService.hide();
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        // console.log(error)
        this.isLoading = false;
        // this.service.spinnerHide()
        if(error.status == 400 || error.status == 404)
          this.service.toastrErr(error.error.message)
        else
          this.service.toastrErr(`Something went wrong`)
      })
    } else {
      this.service.toastrErr(`Please verify captcha`)
    }
  	// this.service.changeSigninBs(`loggedin`)
  }
  // ******************** End Login API **************************

  // ******************** Login Otp API(If Otp Auth or google auth is enabled) ******************
  loginOtpSubmit(val) {
    let validateUrl;
    let validateData;
    if(val === `otp`) {
      if(!this.loginOtp.trim()) {
        return;
      }
      validateUrl = `validate-otp-auth`
      // validateData = { "otp": Object.values(this.loginOtp).join('') }
      validateData = { "otp": this.loginOtp.trim() }
    } else if(val === `google`) {
      if(!this.loginGOtp.trim()) {
        return;
      }
      validateUrl = `validate-google-auth`
      // validateData = { "totp": Object.values(this.loginGOtp).join('') }
      validateData = { "totp": this.loginGOtp.trim() }
    }
    this.isLoading = true;
    // this.service.spinnerShow()
    this.service.postApi(validateUrl, validateData, 2).subscribe(response => {
      this.isLoading = false;
      // this.service.spinnerHide()
      // console.log(JSON.stringify(response))
      if(response.status == 200) {
        if(this.auth === `otp`) {
          $(`#loginOtpAutheticator`).modal(`hide`)
          this.loginSucc()
        } else if(this.auth === `google`) {
          $(`#loginGoogleAutheticator`).modal(`hide`)
          this.loginSucc()
        } else if(this.auth === `both`) {
          if(val === `otp`) {
            // this.loginGOtp = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
            this.loginGOtp = ''
            $(`#loginOtpAutheticator`).modal(`hide`)
            // $(`#loginGoogleAutheticator`).modal(`show`)
            $(`#loginGoogleAutheticator`).modal({backdrop: 'static'})
          } else if(val === `google`) {
            $(`#loginGoogleAutheticator`).modal(`hide`)
            this.loginSucc()
          }
        }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }

    }, error => {
      // console.log(JSON.stringify(error))
      this.isLoading = false;
      // this.service.spinnerHide()
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }
  // ******************** End Login Otp API(If Otp Auth or google auth is enabled) *****************
  loginSucc() {
    // console.log('navigate to login')
    
    if(this.loginForm.value.rememberMe == true)
      localStorage.setItem(`loginData`, JSON.stringify(this.loginForm.value))
    else {
      if(localStorage.getItem(`loginData`) != null)
        localStorage.removeItem(`loginData`)
    }
    this.service.toastrSucc(`Login successfully`)
    localStorage.setItem(`loginToken`, JSON.stringify({ "token": this.profileData.token, "email": this.loginForm.value.email.trim() }))
    localStorage.setItem('loggedIn','true')
    localStorage.setItem('loggedEmail',this.loginForm.value.email.trim())
    this.getPaymentTypes();
    // if(buyToken)

    window.history.length > 2 ? window.history.back() : this.router.navigate([`home`])
    
  }
  // ********************** Signup API *****************************
  signup() {
    // console.log(JSON.stringify(this.registerForm.value))
    this.captchaToken = this.captcha.getResponse();
    this.captcha.reset();
    if(this.captchaToken) {
      let signupData = {
        // "first_name": this.registerForm.value.firstName.trim(),
        // "last_name": this.registerForm.value.lastName.trim(),
        "email": this.registerForm.value.email.trim(),
        // "mobile_number": this.registerForm.value.phoneCode + '-' + this.registerForm.value.phoneNumber.trim(),
        "password": this.registerForm.value.password.trim()
      }
      this.isLoading = true;
      // this.service.spinnerShow()
      this.service.postApi(`signup`, signupData, 0).subscribe( response => {
        // console.log(response)
        this.isLoading = false;
        // this.service.spinnerHide()
        if(response.status == 201) {
          this.service.toastrSucc(response.body.message)
          this.signupData = response.body
          this.service.currToken = response.body.token
          this.registerForm.reset()
          // this.registerForm.controls['phoneCode'].setValue('')
          // this.otp = {"one": "", "two": "", "three": "", "four": "", "five": "", "six": ""};
          $(`#signup_success`).modal({backdrop: 'static'})
          // $(`#otp_Autheticator`).modal(`show`)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        // console.log(error)
        this.isLoading = false;
        // this.service.spinnerHide()
        if(error.status == 400) {
          this.service.toastrErr(error.error.message)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      })
      // this.router.navigate([`/home`])
    } else {
      this.service.toastrErr(`Please verify captcha`)
    }
    
  	// this.service.changeSigninBs(`loggedin`)
  }
  // ********************** End Signup API ***************************
  handleCorrectCaptcha(token) {
    // console.log(token)
    // console.log(`success captcha`)
  }
  handleExpiredCaptcha() {
    // console.log(`expired captcha`)
    // this.captcha.reset()
  }
  // ************* Country List JSON ***********************
  countryListApi() {
    /*
    this.service.getCountriesJson().subscribe(response => {
      this.countryListArr = response.countries
    }, error => {
      this.service.toastrErr(`Something went wrong`)
    })
    */
  }
  // ************ End Country List JSON ********************
  signupDisableFun() {
    let retVal = this.registerForm.invalid || (this.registerForm.controls[`password`].value != this.registerForm.controls[`cnfPassword`].value) || (this.registerForm.controls[`terms`].value == false) ? true : false
    return retVal
  }

  /* changeFocus(otp, val, event) {
    if(otp.length == 1) {
      if(val && val != 'complete') {
        $(`#${val}`).focus()
      }      
    }    
  } */
  /* remove(otp, val, event) {
    if(!otp) {
      if(event.keyCode == 8) {
        if(val == `complete`) {
          this.otp.five = ''
          $(`#fifthInput`).focus()
        }
        else if(val == `sixthInput`) {
          this.otp.four = ''
          $(`#fourthInput`).focus()
        }
        else if(val == `fifthInput`) {
          this.otp.three = ''
          $(`#thirdInput`).focus()
        }
        else if(val == `fourthInput`) {
          this.otp.two = ''
          $(`#secondInput`).focus()
        }
        else if(val == `thirdInput`) {
          this.otp.one = ''
          $(`#firstInput`).focus()
        }
        else if(val == `googleComplete`) {
          this.loginGOtp.five = ''
          $(`#googleFifthInput`).focus()
        }
        else if(val == `googleSixthInput`) {
          this.loginGOtp.four = ''
          $(`#googleFourthInput`).focus()
        }
        else if(val == `googleFifthInput`) {
          this.loginGOtp.three = ''
          $(`#googleThirdInput`).focus()
        }
        else if(val == `googleFourthInput`) {
          this.loginGOtp.two = ''
          $(`#googleSecondInput`).focus()
        }
        else if(val == `googleThirdInput`) {
          this.loginGOtp.one = ''
          $(`#googleFirstInput`).focus()
        }
        else if(val == `loginComplete`) {
          this.loginOtp.five = ''
          $(`#loginFifthInput`).focus()
        } else if(val == `loginSixthInput`) {
          this.loginOtp.four = ''
          $(`#loginFourthInput`).focus()
        }
        else if(val == `loginFifthInput`) {
          this.loginOtp.three = ''
          $(`#loginThirdInput`).focus()
        }
        else if(val == `loginFourthInput`) {
          this.loginOtp.two = ''
          $(`#loginSecondInput`).focus()
        }
        else if(val == `loginThirdInput`) {
          this.loginOtp.one = ''
          $(`#loginFirstInput`).focus()
        }
      }
    }
    
  } */

  // **************** Otp Verify APi(on signup) ******************
  /* submitotp() {
    let otpData = {
      "otp": Object.values(this.otp).join('')
    }
    this.isLoading = true;
    // this.service.spinnerShow()
    this.service.postApi(`otp-verify`, otpData, 2).subscribe(response => {
      // console.log(response)
      this.isLoading = false;
      // this.service.spinnerHide()
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        $(`#otp_Autheticator`).modal(`hide`)
        console.log(JSON.stringify({ "token": this.signupData.token, "email": this.signupData.data.email}))
        localStorage.setItem(`loginToken`, JSON.stringify({ "token": this.signupData.token, "email": this.signupData.data.email }))
        // localStorage.setItem(`isLoggedIn`, `true`)
        window.history.length > 2 ? window.history.back() : this.router.navigate([`home`])
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      // console.log(error)
      this.isLoading = false;
      // this.service.spinnerHide()
      if(error.status == 404 || error.status == 400 ) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
      
    })
  } */
  // **************** End Otp Verify APi(on signup) *****************

  closeSignupModal() {
    $('#signup_success').modal('hide')
    // this.registerForm.reset();
    this.isSignin = true;
    this.router.navigate([`vertex`, `login`])
    $(`#signinTab`).addClass(`active`);
    $(`#signupTab`).removeClass(`active`);
    
  }

  getPaymentTypes() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.service.getApi(`payment-types`, 0).subscribe(response => {
        this.isLoading = false;
        console.log(response)
        if (response.status == 200) {
          let paymentTypes = response.body.data;
          paymentTypes.forEach(p => {

            if (p.payment_type_name === 'Cryptocurrency')
              localStorage.setItem("Cryptocurrency", p.id);
            else if (p.payment_type_name === 'Bank Transfer')
              localStorage.setItem("bankTransfer", p.id)
            else {
              localStorage.setItem("creditCard", p.id);
            }
            console.log(p);
          });
          resolve(true)
        }
      }, error => {
        this.isLoading = false;
      })
    })

  }

}