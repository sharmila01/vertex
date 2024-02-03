import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MainService } from '../../../../providers/mainService.service';
import { FormBuilder, FormGroup, Validators } from '../../../../../../node_modules/@angular/forms';
@Component({
  selector: 'app-mybanking',
  templateUrl: './mybanking.component.html',
  styleUrls: ['./mybanking.component.css']
})
export class MybankingComponent implements OnInit {

  public isLoading: boolean = false;
  bankForm: FormGroup;
  fiatCurrency: any = [];
  bankData: any = [];
  username: string;
  userID;
  bankUser;
  businessCardFileName: any;
  myBank = false;
  profileData: any = [];
  @ViewChild("accountNo") accountNo: ElementRef;
  @ViewChild("iban") iban: ElementRef;

  constructor(private service: MainService, private fb: FormBuilder) { }

  ngOnInit() {
    this.bankForm = this.fb.group({
      account_holder_name: ['', Validators.required],
      iban: [''],
      account_number: [''],
      bank_name: ['', Validators.required],
      bank_address: ['', Validators.required],
      swift_bic_code: ['', Validators.required],
      accepting_fiat_currency: ['', Validators.required],
      account_holder_address: [''],

    })
    this.bankForm.controls['bank_address'].disable();
    this.bankForm.controls['account_number'].disable();
    this.bankForm.controls['iban'].disable();
    this.bankForm.controls['bank_name'].disable();
    this.bankForm.controls['account_holder_name'].disable();
    this.bankForm.controls['swift_bic_code'].disable();
    this.bankForm.controls['accepting_fiat_currency'].disable();
    this.bankForm.controls['account_holder_address'].disable();

    // if(this.bankForm.controls['iban'].value === null || this.bankForm.controls['account_number'].value === null){
    //   this.bankForm.invalid;

    // }
    this.getAcceptedFiatCurrency();
    this.getBankingUser();
    this.getProfileApi();

  }

  getProfileApi() {
    this.isLoading = true;
    this.service.getApi(`profile`, 1).subscribe(response => {
      this.isLoading = false;
      this.profileData = response.body.data;
      this.userID = response.body.data.id;
    }, error => {
      this.isLoading = false;
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }

    })
  }

  getBankingUser() {
    this.isLoading = true;

    this.service.getApi(`user-bank-details`, 1).subscribe(response => {
      this.isLoading = false;
      this.bankUser = response.body.data;
      if (response.status == 201 || response.status == 200) {
        this.bankForm.patchValue({
          account_holder_name: this.bankUser.account_holder_name,
          iban: this.bankUser.iban,
          bank_name: this.bankUser.bank_name,
          bank_address: this.bankUser.bank_address,
          swift_bic_code: this.bankUser.swift_bic_code,
          accepting_fiat_currency: this.bankUser.accepting_fiat_currency,
          account_holder_address: this.bankUser.account_holder_address,
          account_number: this.bankUser.account_number

        })
        this.bankUser = response.body.data;

      } else {
        // this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        // this.service.toastrErr(`Something went wrong`)
      }

    })
  }
  // ************* Get Profile (User Detail) Api **************
  getAcceptedFiatCurrency() {
    this.isLoading = true;
    this.service.getApi(`accepted-fiat-currency`, 1).subscribe(response => {
      console.log('response', response)
      this.isLoading = false;
      if (response.status == 200) {
        this.fiatCurrency = response.body.data
      } else {
        // this.service.toastrErr(`Something went wrong`)
      }

    }, error => {
      this.isLoading = false;
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }

    })
  }
  // ******** End Get Profile (User Detail) Api ***************

  onAddBankDetail(disabled) {
    let formVal = this.bankForm.getRawValue();
    if (disabled) {
      this.bankForm.controls['bank_address'].enable();
      this.bankForm.controls['account_number'].enable();
      this.bankForm.controls['iban'].enable();
      this.bankForm.controls['bank_name'].enable();
      this.bankForm.controls['account_holder_name'].enable();
      this.bankForm.controls['swift_bic_code'].enable();
      this.bankForm.controls['accepting_fiat_currency'].enable();
      this.bankForm.controls['account_holder_address'].enable();
    } else {
      if (formVal.iban === "" && formVal.account_number === "") {
        this.accountNo.nativeElement.focus();
        return false;
      }
      else{
        let data = {
          request: {
            iban: formVal.iban,
            account_number: formVal.account_number,
            bank_name: formVal.bank_name,
            bank_address: formVal.bank_address,
            swift_bic_code: formVal.swift_bic_code,
            accepting_fiat_currency: formVal.accepting_fiat_currency,
            account_holder_address: formVal.account_holder_address
  
          }
        }
        if (this.profileData.user_name !== null) {
          data.request['account_holder_name'] = this.profileData.user_name
        } else if (this.profileData.user_name === null) {
          data.request['account_holder_name'] = formVal.account_holder_name
        }
      this.isLoading = true;
      this.service.postApi('user-bank-details', data.request, 1).subscribe(response => {
        this.isLoading = false;
        this.bankForm.controls['bank_address'].disable();
        this.bankForm.controls['iban'].disable();
        this.bankForm.controls['bank_name'].disable();
        this.bankForm.controls['account_holder_name'].disable();
        this.bankForm.controls['swift_bic_code'].disable();
        this.bankForm.controls['accepting_fiat_currency'].disable();
        this.bankForm.controls['account_holder_address'].disable();
        this.bankForm.controls['account_number'].disable();

        if (response.status == 201 || response.status == 200) {

          this.bankData = response.body.data;

        }
      }, error => {
        this.isLoading = false;
        if (error.status == 404 || error.status == 400)
          this.service.toastrErr(error.error.message)
        else
          this.service.toastrErr('Something went wrong')
      })
    }
  }
  }



  onUpdateBankDetail(disabled) {
    if (disabled) {
      this.bankForm.controls['bank_address'].enable();
      this.bankForm.controls['iban'].enable();
      this.bankForm.controls['account_number'].enable();
      this.bankForm.controls['bank_name'].enable();
      this.bankForm.controls['account_holder_name'].enable();
      this.bankForm.controls['swift_bic_code'].enable();
      this.bankForm.controls['accepting_fiat_currency'].enable();
      this.bankForm.controls['account_holder_address'].enable();
    } else {
      let formVal = this.bankForm.getRawValue();
      if (formVal.iban === "" && formVal.account_number === "") {
        this.accountNo.nativeElement.focus();
        return false;
      }
      else{
      let data = {
        requests: {
          account_holder_name: formVal.account_holder_name,
          iban: formVal.iban,
          account_number: formVal.account_number,
          bank_name: formVal.bank_name,
          bank_address: formVal.bank_address,
          swift_bic_code: formVal.swift_bic_code,
          accepting_fiat_currency: formVal.accepting_fiat_currency,
          account_holder_address: formVal.account_holder_address,
        }
      }
      if (this.profileData.user_name !== null) {
        data.requests['account_holder_name'] = this.profileData.user_name
      } else if (this.profileData.user_name === null) {
        data.requests['account_holder_name'] = formVal.account_holder_name

      }
      this.isLoading = true;
      this.service.putApi('user-bank-details', data.requests, 1).subscribe(response => {
        if (response.status == 201 || response.status == 200) {
          this.bankForm.controls['bank_address'].disable();
          this.bankForm.controls['iban'].disable();
          this.bankForm.controls['bank_name'].disable();
          this.bankForm.controls['account_holder_name'].disable();
          this.bankForm.controls['swift_bic_code'].disable();
          this.bankForm.controls['accepting_fiat_currency'].disable();
          this.bankForm.controls['account_holder_address'].disable();
          this.getAcceptedFiatCurrency();
          this.service.toastrSucc(response.body.message)

        }
      }, error => {
        this.isLoading = false;
        if (error.status == 404 || error.status == 400)
          this.service.toastrErr(error.error.message)
        else
          this.service.toastrErr('Something went wrong')
      })
    }
  }
  }

  //upload Business card
  businessfileChange(event): void {

    if (event.target.files && event.target.files.length > 0) {

      let file = event.target.files[0];
      this.businessCardFileName = file.name;
      //get the file size
      if (file.size < '1048576 ') {
        this.uploadPaymentProof(file);
      }
      else {
        this.service.toastrErr('file size is large');
      }
    }
  }

  public uploadPaymentProof(data) {

    const formData: FormData = new FormData();
    formData.append('document', data);
    formData.append('buy_order', '5');
    formData.append('order_id', 'VTEXB1ETH938671');

    this.service.postApi(`buy-order-payment-proof`, formData, 1).subscribe(response => {

      console.log('response', response);
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

}


