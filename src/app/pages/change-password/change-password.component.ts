import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../providers/mainService.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
	public isLoading:boolean = false;
	changePassForm: FormGroup;
  constructor(private fb: FormBuilder, private service: MainService) {
    window.scrollTo(0, 0)
  }

  ngOnInit() {
  	this.changePassForm = this.fb.group({
      'oldPassword': [ '', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z\d$@$!%*#?&^\S]*$/)]) ],
      'newPassword': [ '', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z\d$@$!%*#?&^\S]*$/)]) ],
      'cnfPassword': [ '', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z\d$@$!%*#?&^\S]*$/)]) ]
    })
  }

  //********************************* Change Password API *************************
  changePassword() {
  	let changePassData = {
  		"oldpassword": this.changePassForm.value.oldPassword,
  		"password": this.changePassForm.value.newPassword
  	}
		this.isLoading = true;
  	this.service.postApi(`change-password`, changePassData, 1).subscribe(response => {
			this.isLoading = false;
  		if(response.status == 200) {
  			this.service.toastrSucc(response.body.message)
  			window.history.back()
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
  //************************** End Change Password API *************************
}
