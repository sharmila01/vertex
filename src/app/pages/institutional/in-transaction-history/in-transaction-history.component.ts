import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-in-transaction-history',
  templateUrl: './in-transaction-history.component.html',
  styleUrls: ['./in-transaction-history.component.css']
})
export class InTransactionHistoryComponent implements OnInit {
  getStatus: boolean = false;
  showSecurity: boolean = false;
  public isLoading: boolean = true;
  txnArr: any = [];
  paginationData: any = {};
  filter: any = { search: '', currPage: 1 };
  incompleteTrans: any = false;
  paymentProf;
  currency;
  receive_amount;
  base64file;
  orderID;
  currencySymbol;
  constructor(private service: MainService, private router: Router) { }

  ngOnInit() {

    this.txnApi(1);
  }
  txnApi(val) {
    this.isLoading = true;
    let data = {
      page: this.filter.currPage,
      is_incomplete: this.incompleteTrans ? "True": "False"
    }
    let url = '';
    /* if(val == 1) {
      // url = `institutional-txn`
      url = `get-transaction`
    } else {
      data['search'] = this.filter.search
      // url = `search-institutional-txn`
      url = `search-transaction`
    } */
    if(val == 1) {
      url = `institutional-txn`
    } else {
      data['search'] = this.filter.search
      url = `search-institutional-txn`
    }
    
    this.service.postApi(url, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.txnArr = response.body.data
        this.paginationData = response.body.pagination_data
      } else {
        this.service.toastrErr(`Something went wrong`)
        this.txnArr = []
        this.paginationData = {}
      }
    }, error => {
      this.txnArr = []
      this.paginationData = {}
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }

  selectedRow(row_data) {    
    this.currency = row_data.fund_symbol;
    this.receive_amount = row_data.fund_received;
    
  }

  onSearch() {
    this.filter.currPage = 1;
    this.filter.search ? this.txnApi(2) : this.txnApi(1)
  }


  changePage(page) {
    this.filter.currPage = page;
    this.filter.search ? this.txnApi(2) : this.txnApi(1)

  }

  getUTC(date) {
    let newDate = new Date(date)
    return new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate(), newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds())
  }

  openEther(txId, symbol = '') {
    // window.open(`https://ropsten.etherscan.io/tx/${txId}`)
    this.service.openEtherPage(txId, symbol)
  }

  viewOrder(item) {
    
    this.router.navigate(['/institutional/view-order', btoa(item.order_id), btoa(item.transaction_status), '2'])
  }

  navigateBuy(item) {
    this.router.navigate(['/buy-token', item.order_id, btoa(item.transaction_status)])
  }

  changeIncompleteTrans() {
    console.log(this.incompleteTrans)
    // let data = {}
  }
  isInlcudeTokenBurning(str = '') {
    if (str && !str.includes('Token Burning'))
      return true
    else
      return false
  }

  confirmPayment(item) {
    this.paymentProf = '';
    $(`#confirm_payment`).modal(`show`);
    this.showSecurity = false;
    this.getStatus = false
    this.orderID = item.id;

  }
  showSecure() {
    this.showSecurity = true;
    this.getStatus = false;
  }
  showStatus() {
    $(`#confirm_payment`).modal(`show`);
    this.confirmBankPayment(this.orderID);
    
  }

  public confirmBankPayment(ID) {
    
    let data = {
      request: {
        "recieved_amount": this.receive_amount,
        "order_id": ID
      }

    }
    if(this.paymentProf > 0){
      data.request ['document']= this.base64file.split(';base64,/').length > 1 ? this.base64file.split(';base64,')[1] : undefined

   }
    this.isLoading = true;
    
    this.service.postApi(`confirm-bank-payment`, data.request, 1).subscribe(response => {
      this.isLoading = false;
      $(`#confirm_payment`).modal(`show`);
      this.txnApi(1);
      this.showSecurity = false;
      this.getStatus = true;
      // this.service.toastrSucc(`file uploaded success`);
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`something went wrong`);
    })
  }

  fileChangeEvent(event, type) {
    if (event.target.files && event.target.files[0]) {
      const inputValue = event.target;
      var file: File = inputValue.files[0];
      let reader = new FileReader();
      this.paymentProf = file.name;
      reader.onload = ((e: any) => {
        this.base64file = e.target.result;
      })
      reader.readAsDataURL(event.target.files[0])
    }
  }

  // fileChangeEvent($event) {
  //   const inputValue = $event.target;
  // var file: File = inputValue.files[0];
  // var myReader: FileReader = new FileReader();
  // this.paymentProf = file.name;
  // myReader.onloadend = (e) => {
  //   console.log(myReader.result)
  //   const fileString = myReader.result.toString();
  //   const fileArray = fileString.split(',');
  //   let attfilename=file.name.split('.');
  //   this.uploadPaymentProof(myReader.result);
  // }
  // myReader.readAsDataURL(file);
  //   }

  confirmTransaction(){
   
    this.service.toastrSucc(`payment confirmed`);
    // this.txnApi(1);
  }

}
