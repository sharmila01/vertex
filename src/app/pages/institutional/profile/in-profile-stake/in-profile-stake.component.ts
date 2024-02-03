import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../../providers/mainService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-in-profile-stake',
  templateUrl: './in-profile-stake.component.html',
  styleUrls: ['./in-profile-stake.component.css']
})
export class InProfileStakeComponent implements OnInit {
  public isLoading:boolean = true;
  stakeData : any = {};
  stakeTransactionData : any = {admin_stake_address: null};
  profileForm: FormGroup;
  constructor(private service: MainService, private fb: FormBuilder) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      stakeaddress : ['', Validators.required]
    })
    this.profileForm.controls['stakeaddress'].disable()
    this.getProfileApi();
  }

  // ************* Get Profile (User Detail) Api **************
  getProfileApi() {
    
  	this.isLoading = true;
  	this.service.getApi(`profile`, 1).subscribe(response => {
  		this.isLoading = false;
  		if(response.status == 200) {
        this.stakeData = response.body.stake_data;
        this.stakeTransactionData = response.body.stake_transact;
        this.profileForm.patchValue({
          stakeaddress : this.stakeData.stake_address
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

  // stake address
  saveStakingAddress(disabled) {
    if(disabled) {
      this.profileForm.controls['stakeaddress'].enable()
    } else {
      let stakeAddress = {
        "stake_data": {  
            "stake_address": this.profileForm.value.stakeaddress
       }
     }  
     this.isLoading = true;
     this.service.postApi(`profile`, stakeAddress, 1).subscribe(response => {
      this.isLoading = false;
       if(response.status == 200) {
         this.service.toastrSucc(response.body.message)
         this.profileForm.controls['stakeaddress'].disable()
         console.log(response.body.popup)
         this.getProfileApi()
         response.body.popup ? $(`#in-stake-address`).modal(`show`) : ''
         
         // this.stakingData = true;
         
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
  // ************** End Update Profile Api ********************
  openEther(txId, symbol = '') {
    // window.open(`https://ropsten.etherscan.io/tx/${txId}`)
    this.service.openEtherPage(txId, symbol)
  }
  copyToClipboard(text) {
    this.service.copyToClipboard(text);
  }

}
