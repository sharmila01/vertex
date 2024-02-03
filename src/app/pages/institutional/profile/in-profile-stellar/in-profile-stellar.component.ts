import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../../../providers/mainService.service';

@Component({
  selector: 'app-in-profile-stellar',
  templateUrl: './in-profile-stellar.component.html',
  styleUrls: ['./in-profile-stellar.component.css']
})
export class InProfileStellarComponent implements OnInit {
  public isLoading:boolean = true;
  profileForm: FormGroup;
  constructor(private service: MainService, private fb: FormBuilder) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      stellar: ['', Validators.required]
    })
    this.profileForm.controls['stellar'].disable()
    this.getProfileApi();
  }
  // ************* Get Profile (User Detail) Api **************
  getProfileApi() {
  	this.isLoading = true;
  	this.service.getApi(`profile`, 1).subscribe(response => {
  		this.isLoading = false;
  		if(response.status == 200) {
        let profileData = response.body.data;
        this.profileForm.patchValue({
          stellar: profileData.steller_address || ''
        })
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

  changeAddress(disabled) {
    if(disabled) {
      this.profileForm.controls['stellar'].enable()
    } else {
      let address = {
        "steller_address" : this.profileForm.value.stellar
      }
      this.isLoading = true;
      this.service.postApi(`profile`, address, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.profileForm.controls['stellar'].disable()
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

  copyToClipboard(text) {
    this.service.copyToClipboard(text);
  }

}
