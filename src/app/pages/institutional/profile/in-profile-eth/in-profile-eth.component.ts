import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../../providers/mainService.service';
import { FormBuilder, FormGroup, Validators } from '../../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-in-profile-eth',
  templateUrl: './in-profile-eth.component.html',
  styleUrls: ['./in-profile-eth.component.css']
})
export class InProfileEthComponent implements OnInit {
  public isLoading:boolean = true;
  profileForm: FormGroup;
  constructor(private service: MainService, private fb: FormBuilder) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      eth: ['', Validators.required]
    })
    this.profileForm.controls['eth'].disable()
    this.getProfileApi();
    // console.log(this.profileForm.controls['eth'].disabled)
  }

  // ************* Get Profile (User Detail) Api **************
  getProfileApi() {
  	this.isLoading = true;
  	this.service.getApi(`profile`, 1).subscribe(response => {
  		
  		if(response.status == 200) {
        let profileData = response.body.data;
        this.profileForm.patchValue({
          eth: profileData.eth_address
        })
  		} else {
  			this.service.toastrErr(`Something went wrong`)
      }
      this.isLoading = false;
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
  // ETH Address
  changeAddress(disabled) {
    if(disabled) {
      this.profileForm.controls['eth'].enable()
    } else {
      let address = {
        "eth_address" : this.profileForm.value.eth
      }
      this.isLoading = true;
      this.service.postApi(`profile`, address, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.profileForm.controls['eth'].disable()
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
