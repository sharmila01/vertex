import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../../../providers/mainService.service';

@Component({
  selector: 'app-in-invite-friend',
  templateUrl: './in-invite-friend.component.html',
  styleUrls: ['./in-invite-friend.component.css']
})
export class InInviteFriendComponent implements OnInit {
  public isLoading:boolean = false;
  inviteForm: FormGroup;
  constructor(private fb: FormBuilder, private service: MainService) { }

  ngOnInit() {
    this.inviteForm  = this.fb.group({
      'email': [ '', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)]) ]
    })

  }

  inviteFriend() {
    let data = {
      email: this.inviteForm.value.email
    }
    this.isLoading = true;
    this.service.postApi(`invite-friend`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        this.inviteForm.reset()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 400) 
        this.service.toastrErr(error.error.message)
      else
        this.service.toastrErr(`Something went wrong`)
    })
  }

}
