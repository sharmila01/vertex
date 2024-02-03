import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../providers/mainService.service';

@Component({
  selector: 'app-upgrade-b3',
  templateUrl: './upgrade-b3.component.html',
  styleUrls: ['./upgrade-b3.component.css']
})
export class UpgradeB3Component implements OnInit {
  public isLoading: boolean = false;
  upgradeForm: FormGroup;
  applicationData: any = '';
  constructor(private fb: FormBuilder, private service: MainService) { }

  ngOnInit() {
    this.upgradeForm = this.fb.group({
      proofOfRes: ['', Validators.required],
      bankStatement: ['', Validators.required],
      terms: [false, Validators.required]
    })
    this.getapplicationApi()
  }
  /************** File Change For Image ******************/
  fileChangeEvent(event, type) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = ((e: any) => {
        this.upgradeForm.controls[type].setValue(e.target.result)
      })
      reader.readAsDataURL(event.target.files[0])
    }
  }
  /************** End File Change For Image ******************/

  /***** Return Form (Getter)***********/
  get form(){
    return this.upgradeForm.controls;
  }
  /***** End Return Form (Getter)***********/

  /************** Get Application API ****************/

  getapplicationApi() {
    this.isLoading = true;
    this.service.getApi('get-application', 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        let applicationData = response.body.data
        this.applicationData = applicationData
        if(applicationData) {
          if(applicationData.bank_statement) {
            this.upgradeForm.patchValue({
              bankStatement: applicationData.bank_statement,
              proofOfRes: applicationData.proof_of_residence,
              terms: applicationData.is_read_term_cond_policy
            })
          }
        }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }
  /************** End Get Application API ****************/

  // *************** Update Application API ******************* //
  upgrade() {
    let formVal = this.upgradeForm.value
    let data = {
      proof_of_residence: formVal.proofOfRes.split(';base64,').length > 1 ? formVal.proofOfRes.split(';base64,')[1] : undefined,
      bank_statement: formVal.bankStatement.split(';base64,').length > 1 ? formVal.bankStatement.split(';base64,')[1] : undefined,
      is_read_term_cond_policy: formVal.terms
    }
      this.isLoading = true
      this.service.postApi(`institutional-application`, data, 1).subscribe(response => {
        this.isLoading = false
        if(response.status == 200) {
          this.service.toastrSucc(response.body.message)
          window.history.back()
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        this.isLoading = false
        this.service.toastrErr(`Something went wrong`)
      })
    }
    // *************** End Update Application API ******************* //
    
  

}
