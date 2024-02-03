import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../../providers/mainService.service';
import { FormBuilder, FormGroup, Validators } from '../../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-in-profile-btc',
  templateUrl: './in-profile-btc.component.html',
  styleUrls: ['./in-profile-btc.component.css']
})
export class InProfileBtcComponent implements OnInit {
  public isLoading:boolean = true;
  profileForm: FormGroup;
  constructor(private service: MainService, private fb: FormBuilder) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      btc: ['', Validators.required]
    })
    this.profileForm.controls['btc'].disable()
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
          btc: profileData.btc_address || ''
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
      this.profileForm.controls['btc'].enable()
    } else {
      let address = {
        "btc_address" : this.profileForm.value.btc
      }
      this.isLoading = true;
      this.service.postApi(`profile`, address, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.profileForm.controls['btc'].disable()
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
