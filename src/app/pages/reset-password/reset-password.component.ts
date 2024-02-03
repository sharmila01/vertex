import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../providers/mainService.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public isLoading:boolean = false;

  resetForm: FormGroup;
  currId: any = ``;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private service: MainService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currId = params[`id`]
    })
    this.resetForm = this.fb.group({
      'password': [ '', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z\d$@$!%*#?&^\S]*$/)]) ],
      'cnfPassword': [ '', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z\d$@$!%*#?&^\S]*$/)]) ]
    })
  }

  // ***************** Reset Passsword Api **********************
  resetPassword() {
    let resetData = {
      "id": this.currId,
      "password": this.resetForm.value.password.trim()
    }
    this.isLoading = true;
    // this.service.spinnerShow()
    this.service.postApi(`website-reset-password`, resetData, 0).subscribe(response => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        this.router.navigate([`/vertex`, `login`])
      } else {
        this.service.toastrErr(`Something went wrong`)
      }

    }, error => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)  
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
      
    })
  }
  // ********************* End Reset Password Api ****************

}
