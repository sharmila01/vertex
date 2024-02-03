import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../../providers/mainService.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
	forgotForm: FormGroup;
  public isLoading:boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private service: MainService) {
  	window.scrollTo(0, 0)
  }

  ngOnInit() {
  	this.forgotForm = this.fb.group({
  		'email': [ '', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)]) ]
  	})
  }
  // ******************** Forgot Password API ***********************
  forgotPassword() {
  	// console.log(this.forgotForm.value)
    let frgtData = { "email": this.forgotForm.value.email }
    this.isLoading = true;
    this.service.postApi(`website-forgot-password`, frgtData, 0).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        this.router.navigate([`/vertex`, `login`])
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
  // ****************** End Forgot Password API *********************

}
