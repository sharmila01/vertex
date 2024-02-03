import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../../providers/mainService.service';

@Component({
  selector: 'app-in-upgrade-tier',
  templateUrl: './in-upgrade-tier.component.html',
  styleUrls: ['./in-upgrade-tier.component.css']
})
export class InUpgradeTierComponent implements OnInit {
  companyForm: FormGroup;
  public isLoading: boolean = false;
  countryListArr: any = [];
  platformArr: any = []
  applicationData: any = '' ;
  sellerTier: any = '';
  imageUploaded: any = '';
  constructor(private fb: FormBuilder, private service: MainService) { }

  async ngOnInit() {
    this.countryListArr = this.service.countryList
    
    this.companyForm = this.fb.group({
      'registerAs': ['', Validators.required],
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

  get cForm() {
    return this.companyForm.controls;
  }
  fileChangeEvent(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = ((e: any) => {
        // console.log(e.target.result)
        // this.addProjectForm.controls['image'].setValue(e.target.result)
        this.companyForm.controls['image'].setValue(e.target.result)
      })
      reader.readAsDataURL(event.target.files[0])
    }
  }

  registerSelling() {
    let formVal = this.companyForm.value
    let data = {
      institutional_type: formVal.registerAs,
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
  getSellingApi() {
    this.isLoading = true;
    this.service.getApi('get-application', 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        this.applicationData = response.body.data
        this.sellerTier = response.body.seller_tier
        if(this.applicationData.institutional_type == 'Company') {
          let arr = this.applicationData.scan_copy_of_registration.split('/')
          this.imageUploaded =  arr[arr.length - 1]
          this.companyForm.patchValue({
            registerAs: this.applicationData.institutional_type,
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
          this.companyForm.disable()
        }
        
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
  isDisableFun() {
    if(this.applicationData.institutional_type == 'Company') {
      return true;
    }
    if(this.companyForm.invalid || !this.companyForm.value.terms) return true
    else return false;
  }

  goBack() {
    window.history.back()
  }
  
}
