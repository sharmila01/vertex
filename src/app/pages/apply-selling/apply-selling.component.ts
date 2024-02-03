import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../providers/mainService.service';

declare var $: any;
@Component({
  selector: 'app-apply-selling',
  templateUrl: './apply-selling.component.html',
  styleUrls: ['./apply-selling.component.css']
})
export class ApplySellingComponent implements OnInit {
  public isLoading: boolean = false;
  privateForm: FormGroup;
  companyForm: FormGroup;
  regType: any = ''
  countryListArr: any = [];
  platformArr: any = [];
  applicationData: any;
  isInstitutional: boolean;
  @ViewChild('proofOfResidence') proofOfResidence1:ElementRef;

  constructor(private fb: FormBuilder, private service: MainService) { }

  async ngOnInit() {
    
    
    
    this.countryListArr = this.service.countryList
    this.privateForm = this.fb.group({
      'address': ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9,$#&^.@!/'-\s]*$/)])],
      'image': ['', Validators.required ],
      'platform': ['', Validators.required],
      // 'tokenAdd': ['', Validators.compose([ Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9,$#&^.@!/'-]*$/) ])],
      'terms': [false, Validators.required]
    })
    this.companyForm = this.fb.group({
      'regNo': ['', Validators.compose([ Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9,$#&^.@!/'-\s]*$/) ]) ],
      'country': [null, Validators.required],
      'image': ['', Validators.required],
      'companyName': ['', Validators.compose([ Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9\s,$#&^.@!/'-]*$/) ])],
      'startYear': ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[1-9])\d{4,4}$/) ])],
      'director': ['', Validators.compose([ Validators.required, Validators.pattern(/^[^\s][a-zA-Z\s]*$/) ])],
      'registryLink': ['', Validators.compose([Validators.required, Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/)])],
      'platform': ['', Validators.required],
      // 'tokenAdd': ['', Validators.compose([ Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9,$#&^.@!/'-]*$/) ])],
      'terms': [false, Validators.required]
    })
    await this.getPlatformApi()
    this.getSellingApi()
  }

  changeRegType() {
    this.applicationData = ''
    this.privateForm.reset()
    this.companyForm.reset()
    this.privateForm.patchValue({
      platform: '',
      terms: false
    })
    this.companyForm.patchValue({
      country: null,
      platform: '',
      terms: false
    })
  }

  getSellingApi() {
    this.isLoading = true;
    this.service.getApi('get-application', 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        this.applicationData = response.body.data
        this.isInstitutional = response.body.is_institutional
        
        if(this.applicationData) {
          this.regType = this.applicationData.institutional_type
          if(this.regType == 'Individual') {
            let arr = this.applicationData.proof_of_residence.split('/')
            this.privateForm.patchValue({
              address: this.applicationData.residence_address,
              image: arr[arr.length - 1],
              platform: this.applicationData.token_platform,
              // tokenAdd: this.applicationData.token_address,
              terms: this.applicationData.is_read_term_cond_policy
            })
            
            if(this.isInstitutional) this.privateForm.disable()
            if(this.applicationData.institutional_type && this.applicationData.verify_stage  != 'UNVERIFIED') {
              this.privateForm.disable()
            }
             /* setTimeout(() => {
            console.log(this.proofOfResidence1.nativeElement.value)
            this.proofOfResidence1.nativeElement = new File([""], "filename.png")
            console.log(this.proofOfResidence1.nativeElement.value)
          
            },110)  */
          } else if(this.regType == 'Company'){
            let arr = this.applicationData.scan_copy_of_registration.split('/')
            this.companyForm.patchValue({
              regNo: this.applicationData.company_registration_no,
              country: this.applicationData.country_of_registration,
              image: arr[arr.length - 1],
              companyName: this.applicationData.company_name,
              startYear: this.applicationData.incorporation_year,
              director: this.applicationData.managing_director_name,
              registryLink: this.applicationData.online_comp_registry_url,
              platform: this.applicationData.token_platform,
              // tokenAdd: this.applicationData.token_address,
              terms: this.applicationData.is_read_term_cond_policy
            })
            if(this.isInstitutional) this.companyForm.disable()
            if(this.applicationData.institutional_type && this.applicationData.verify_stage  != 'UNVERIFIED') {
              this.companyForm.disable()
            }
            
          } else {
            this.regType = ''
          }
          
        }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false
      this.service.toastrErr(`Something went wrong`)
    })
  }

 
  getPlatformApi() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.service.getApi(`get-platform`, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.platformArr = response.body.data
          resolve(true)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        this.isLoading = false;
        this.service.toastrErr(`Something went wrong`)
      })
    })
  }

  fileChangeEvent(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = ((e: any) => {
        // this.addProjectForm.controls['image'].setValue(e.target.result)
        if(this.regType == 'Company') {
          this.companyForm.controls['image'].setValue(e.target.result)
        } else if(this.regType == 'Individual') {
          this.privateForm.controls['image'].setValue(e.target.result)
        }
      })
      reader.readAsDataURL(event.target.files[0])
    }
  }
  registerSelling() {
    let data = {};
    if(this.regType == 'Individual') {
      let formVal = this.privateForm.value
      data = {
        institutional_type: this.regType,
        residence_address: formVal.address,
        proof_of_residence: formVal.image.split(';base64,').length > 1 ? formVal.image.split(';base64,')[1] : undefined,
        token_platform: formVal.platform,
        // token_address: formVal.tokenAdd,
        is_read_term_cond_policy: formVal.terms
      }
    } else  {
      let formVal = this.companyForm.value
      data = {
        institutional_type: this.regType,
        company_registration_no: formVal.regNo,
        country_of_registration: formVal.country,
        scan_copy_of_registration: formVal.image.split(';base64,').length > 1 ? formVal.image.split(';base64,')[1] : undefined,
        company_name: formVal.companyName,
        incorporation_year: formVal.startYear,
        managing_director_name: formVal.director,
        online_comp_registry_url: formVal.registryLink,
        token_platform: formVal.platform,
        // token_address: formVal.tokenAdd,
        is_read_term_cond_policy: formVal.terms
      }
    }
    this.isLoading = true;
    this.service.postApi(`institutional-application`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        window.history.back()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }
  get pForm() {
    return this.privateForm.controls;
  }

  get cForm() {
    return this.companyForm.controls;
  }
  isDisableFun() {
    if(this.applicationData) {
      if(this.isInstitutional) return true;
      if(this.applicationData.institutional_type && this.applicationData.verify_stage != 'UNVERIFIED') {
        return true;
      } else {
        return false;
      }
      
    } else {
      if(!this.regType) return true
      else if(this.regType == 'Company' && (this.companyForm.invalid || !this.companyForm.value.terms)) return true
      else if(this.regType == 'Individual' && (this.privateForm.invalid || !this.privateForm.value.terms)) return true
      else return false
    }
    
  }
  isRegDisableFun() {
    if(this.applicationData && this.isInstitutional || (this.applicationData && this.applicationData.institutional_type && this.applicationData.verify_stage != 'UNVERIFIED')) {
      return true;
    } else {
      return false;
    }
  }

}
