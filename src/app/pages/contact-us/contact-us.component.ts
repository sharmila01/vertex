import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactusForm: FormGroup;
  public isLoading:boolean = false;
  countryListArr: any = [];
  allCountryListArr: any = []
  constructor(private service: MainService, private fb: FormBuilder, private router: Router) {
  	window.scrollTo(0, 0)
  }

  ngOnInit() {
    this.countryListArr = this.service.countryList
    this.allCountryListArr = this.service.allCountryList
  	this.contactusForm = this.fb.group({
      'name': [ '', Validators.compose([ Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/), Validators.minLength(2) ]) ],
      'email': [ '', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i) ]) ],
      'country': [ null, Validators.required ],
      'message': ['', Validators.compose([Validators.required, Validators.pattern(/^\S.+\S$/) ])]
    })
  }
  // ****************** Contact Us API ***********************
  contactUs() {
   
    let contactData = {
      "email": this.contactusForm.value.email,
      "name": this.contactusForm.value.name,
      "country": this.contactusForm.value.country,
      "message": this.contactusForm.value.message
    }
    this.isLoading = true;
    this.service.postApi(`contact-us`, contactData, 0).subscribe(response => {
      this.isLoading = false;
      if(response.status == 201) {
        this.service.toastrSucc(response.body.message)
        this.router.navigate(['/home'])
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
    
  }
  // ****************** End Contact Us API **********************

  changeCode() {
    if(this.contactusForm.controls[`phoneCode`].value) {
      let index = this.countryListArr.findIndex(x => x.code == this.contactusForm.controls[`phoneCode`].value)
      if(index != -1)
        this.contactusForm.controls[`country`].setValue(this.countryListArr[index].country)      
    }
  }

  changeCountry() {
    if(this.contactusForm.controls[`country`].value) {
      let index = this.countryListArr.findIndex(x => x.country == this.contactusForm.controls[`country`].value)
      if(index != -1)
        this.contactusForm.controls[`phoneCode`].setValue(this.countryListArr[index].code)
    }
  }

  // ************* Country List JSON ***********************
  countryListApi() {
   this.isLoading = true;
    this.service.getCountriesJson().subscribe(response => {
      this.isLoading = false;
      this.countryListArr = response.countries
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }
  // ************ End Country List JSON ********************

}
