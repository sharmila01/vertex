import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router } from '@angular/router';
import { SeoService } from '../../providers/seo.service';
declare var $: any;

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  public isLoading:boolean = true;
  currPage: any = 1;
  transData: any = {"data": [], "pagination_data": {}};
  searchVal = new Subject();
  search: any = '';
  mainTokenName: any = ''
  incompleteTrans: any = false;

  getStatus: boolean = false;
  showSecurity: boolean = false;
  paymentProf;
  currency;
  receive_amount;
  base64file;
  orderID;
  profile:any = [];
  constructor(private service: MainService, private router: Router, private seo:SeoService) {
  	window.scrollTo(0, 0)
  }

  ngOnInit() {
    this.profileApi();
    this.seo.generateTags({
      title: 'Vertex Market | OTC Digital Assets | Aftermarket', 
      description: 'Vertex Market is a secondary market OTC Trading Platform for digital assets such as Utility Tokens, Security Tokens and Stable Coins as well as for major cryptocurrencies such as Bitcoin, Ethereum, Monero and others. Vertex provides comprehensive information about ICO and other blockchain related projects.'
    })
    this.mainTokenName = this.service.mainTokenName
    this.transApi()
    
  	this.searchVal.debounceTime(500).distinctUntilChanged().subscribe(res => {
      this.currPage = 1;
      this.search = res
      if(this.search)
        this.searchTransApi()
      else 
        this.transApi()
  	})
  }
  getLocalString(item) {
    if(item)
      return item.toLocaleString()
    else 
      return 0
  }
  getUTCDateFun(date) {
    let d = new Date(date);
    let dd = (d.getUTCMonth() < 10 ) ? '0'+ d.getUTCMonth() : d.getUTCMonth()
    let dm = (d.getUTCDate() < 10 ) ? '0'+ d.getUTCDate() : d.getUTCDate()

    let d1 = dm + '/' + dd + '/' + d.getUTCFullYear()
    let dH = (d.getUTCHours() < 10 ) ? '0'+ d.getUTCHours() : d.getUTCHours()
    let dM = (d.getUTCMinutes() < 10 ) ? '0'+ d.getUTCMinutes() : d.getUTCMinutes()
    let dS = (d.getUTCSeconds() < 10 ) ? '0'+ d.getUTCSeconds() : d.getUTCSeconds()
    let hours = d.getUTCHours()
    let minutes = d.getUTCMinutes()
    let ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    let minutes1 = minutes < 10 ? ('0'+minutes) : minutes;
    var strTime = hours + ':' + minutes1 + ' ' + ampm;

    return d1 + ' ' +  strTime;
  }

  profileApi() {
    this.isLoading = true;

    this.service.getApi(`profile`, 1).subscribe(response => {
      console.log('profileData----------------------', response);
      this.profile = response.body.data;
      this.isLoading = false;


    }, error => {
      this.isLoading = false
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }


    })
  }
  getStyleColor(item) {
    if (item.transaction_status === 'Awaiting Payment') {
        return "#black";
    } else {
        return "#fff";
    }
  }
  // ******************** Transaction History Api ****************************
  transApi() {
  	let trnData =  { 
      "page": this.currPage,
      "is_incomplete": this.incompleteTrans ? "True": "False"
    }
    this.isLoading = true;
  	this.service.postApi(`get-transaction`, trnData, 1).subscribe(response => {
      console.log('response',response);
      this.isLoading = false;
  		if(response.status == 200) {
  			this.transData = response.body
  		} else {
  			this.service.toastrErr('Something went wrong')
  		}
  	}, error => {
      this.isLoading = false;
			this.service.toastrErr('Something went wrong')
  	})
  }
  // ******************** End Transaction History Api *************************

  selectedRow(row_data) {    
    this.currency = row_data.fund_symbol;
    this.receive_amount = row_data.fund_received;
  }
  // ******************** Search Transaction History Api **********************
  searchTransApi() {
    let searchData = { 
      "search": this.search, 
      "page": this.currPage,
      "is_incomplete": this.incompleteTrans ? "True": "False"
    }
    this.isLoading = true;
    this.service.postApi('search-transaction', searchData, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.transData = response.body  
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
      
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }
  // ******************** End Search Transaction History Api *****************


  // **************************** Page Change ********************************
  changePage(page) {
  	this.currPage = page;
    if(this.search)
      this.searchTransApi()
    else 
  	  this.transApi()
  }
  onSearch() {
    this.currPage = 1;
    if(this.search)
      this.searchTransApi()
    else 
  	  this.transApi()
  }
  // **************************** End Page Change ****************************
  openEther(txId, symbol = '') {
    this.service.openEtherPage(txId, symbol)
  }
  navigateBuy(item) {
    this.router.navigate(['/buy-token', item.order_id, btoa(item.transaction_status), item.payment_type])
  }
  goBack() {
    window.history.back()
  }

  confirmPayment(item) {
    this.paymentProf = '';
    $(`#confirm_payment`).modal(`show`);
    this.showSecurity = false;
    this.getStatus = false
    this.orderID = item.id;

  }
  showSecure() {
    this.confirmBankPayment(this.orderID);

  }
  showStatus() {
    this.showSecurity = false;
    this.getStatus = true
  }

  public confirmBankPayment(ID) {
    let data = {
      request: {
        "recieved_amount": this.receive_amount,
        "order_id": ID
      }

    }
    this.isLoading = true;

    this.service.postApi(`confirm-bank-payment`, data.request, 1).subscribe(response => {
      console.log('response', response);
      this.isLoading = false;
      $(`#confirm_payment`).modal(`show`);
      this.showSecurity = true;
      this.getStatus = false
      
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



  confirmTransaction(){
    this.transApi();
    this.service.toastrSucc(`payment confirmed`);
  }

}