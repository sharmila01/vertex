import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

declare var $: any;
interface EditPrice {
  offer_type: String,
  offering_order_id: String,
  symbol_name: String,
  token_ticker: String,
  payment_type: number,
  accepting_currency: string
}
@Component({
  selector: 'app-in-offerings',
  templateUrl: './in-offerings.component.html',
  styleUrls: ['./in-offerings.component.css']
})
  
export class InOfferingsComponent implements OnInit {
  public isLoading:boolean = true;
  offeringArr: any = [];
  paginationData: any = {};
  filter: any = { search: '', currPage: 1 };
  currId: any = '';
  symbolArr: any = [];
  currModalData : any = {qr: null};
  pendingOrderData: any = {currPage: 1, data: [], paginationData: {}}
  priceForm: FormGroup;
  currEditData: EditPrice;
  priceVal = new Subject();
  thirdPriceVal = new Subject();
  priceUSDVal: any;
  constructor(private service: MainService, private router: Router, private fb: FormBuilder) { }

  async ngOnInit() {
    // await this.getPlatformApi()
    // await this.getPlatformApi()
    this.offeringListApi()
    this.priceForm = this.fb.group({
      price: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,10})?$/)])],
      thirdPrice: ['0']
    })
    this.priceVal.debounceTime(500).distinctUntilChanged().subscribe(res => {
      console.log(`price value change ==>> ${res}`)
      // this.addOfferingForm.controls['price'].setValue(res)
      if(res) this.priceChangeApi()
    })
    this.thirdPriceVal.debounceTime(500).distinctUntilChanged().subscribe(res => {
      console.log('third price value chaneg ==> ', res)
      if(res) this.priceChangeApi()
      else if(res == 0) this.priceUSDVal = '';
    })
  }

  offeringListApi() {
    let data = {
      page: this.filter.currPage
    }
    this.isLoading = true;
    this.service.postApi(`institutional-offering`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.offeringArr = response.body.data
        this.paginationData = response.body.pagination_data
      } else {
        this.service.toastrErr(`Something went wrong`)
        this.offeringArr = []
        this.paginationData = {}
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
      this.offeringArr = []
      this.paginationData = {}
    })

  }
  changePage(page) {
    this.filter.currPage = page;
    this.filter.search ? this.searchApi() : this.offeringListApi()
  }

  onSearch() {
    // console.log('search api')
    this.filter.currPage = 1;
    this.filter.search ? this.searchApi() : this.offeringListApi()
    
  }
  searchApi() {
    let data = {
      page: this.filter.currPage,
      search: this.filter.search
    }
    this.isLoading = true;
    this.service.postApi(`institutional-search`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.offeringArr = response.body.data
        this.paginationData = response.body.pagination_data
      } else {
        this.service.toastrErr(`Something went wrong`)
        this.offeringArr = []
        this.paginationData = {}
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
      this.offeringArr = []
      this.paginationData = {}
    })
  }
  deleteModal(id) {
    // console.log('delete modal => ', id)
    this.currId = id
    $('#delete_offering_inst').modal({backdrop: 'static'})
  }
  onDelete() {
    // console.log('delete')
    let data = {
      offering_id: this.currId
    }
    this.isLoading = true;
    this.service.postApi(`institutional-delete`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        
        this.filter.search ? this.searchApi() : this.offeringListApi()
        
      } else {
        this.service.toastrErr('Something went wrong')
      }
      $('#delete_offering_inst').modal('hide')
    }, error => {
      this.isLoading = false;
      $('#delete_offering_inst').modal('hide')
      if(error.status == 404)
        this.service.toastrErr(error.error.message)
      else 
        this.service.toastrErr('Something went wrong')
    })

  }

  onEdit(item) {
    if(!item.is_approved) {
      this.router.navigate(['/institutional/add-offering', item.id])
    } else 
      this.service.toastrErr(`Approved offering can not be edited`)
  }
  /* getPlatformApi() {
    return new Promise((resolve, reject) => {
      this.service.spinnerShow()
      this.service.getApi(`get-platform`, 1).subscribe(response => {
        this.service.spinnerHide()
        if(response.status == 200) {
          this.symbolArr = response.body.data
          resolve(true)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        this.service.spinnerHide()
        this.service.toastrErr(`Something went wrong`)
      })
    })
  } */
  /* getSymbol(symbol) {
    let arr =  this.symbolArr.filter(x => x['id'] == symbol)
    return arr.length?  arr[0].acceptable_token_symbol : ''
  } */

  payFund(item) {
    // console.log(item) (item?.is_cancel || item.is_closed || item.soft_close)
    if(item.is_live) {
      this.service.toastrErr(`You have already paid`)
    } else if(item.is_cancel || item.is_closed || item.soft_close) {
      this.service.toastrErr(`Your offering is closed or cancelled so you can not pay`)
    } else {
      if(!item.is_approved)
        this.service.toastrErr(`Your offering is not approved so you can not pay`)
      else {
        // console.log('Please pay')
        this.currModalData = Object.assign({}, { qr: item.adress_for_pay, eth: item.eth_pay,  token: item.token_pay, token_name: item.token_name, id_for_pay: item.id_for_pay, ticker: item.ticker, btc_pay: item.btc_pay, token_ticker: item.token_ticker })
        $('#qr_offering_modal').modal({backdrop: 'static'})
      }

    }
  }
  updateFund(item) {
    $(`#qr_offering_modal`).modal('hide');
    let data = {
      id: item.id_for_pay,
      eth_address: item.qr
    }
    this.service.postApi(`offering-approval-fund-scan`, data, 1).subscribe(response => { })

  }
  // goToFund() {
  //   $('#inAddOffering').modal('hide')
  //   this.router.navigate(['/institutional/fund-transfer'])
  // }
  copyToClipboard(text) {
    this.service.copyToClipboard(text);
  }
  openPendingOrderModal(val, item) {
    if(val == 1) {
      this.pendingOrderData = Object.assign({}, {id: item.id, data: [], paginationData: {}, currPage: 1})
    }
    let data = {
      "offering_id": this.pendingOrderData.id,
      "page": this.pendingOrderData.currPage
    }
    this.isLoading = true
    
    this.service.postApi('pending-order-offering', data, 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        this.pendingOrderData.data = response.body.data
        this.pendingOrderData.paginationData = response.body.pagination_data
        $('#pending_order_modal').modal({backdrop: 'static'})
      } else {
        this.service.toastrErr(`Something went wrong`);
      }
    }, error => {
      this.isLoading = false
      this.service.toastrErr(`Something went wrong`);
    })
  }
  changeModalPage(page) {
    this.pendingOrderData.currPage = page;
    this.openPendingOrderModal(2, null)
  }

  editPriceModal(offering) {
    if(!offering.is_approved) {
      this.service.toastrErr(`Pending Offering price can't be change`)
      return;
    } else if(offering.is_closed || offering.soft_close || offering.is_cancel) {
      this.service.toastrErr(`Offering price can't be change because offering is closed or cancelled`)
      return;
    } else if(!offering.is_live){
      this.service.toastrErr(`Offering is not live so offering price can't be changed`);
      return;
    }
    this.currEditData = {
      offer_type: offering.offer_type,
      offering_order_id: offering.offering_order_id,
      symbol_name: offering.symbol_name,
      token_ticker: offering.token_ticker,
      payment_type : offering.payment_type,
      accepting_currency : offering.accepting_currency
    }
    this.priceForm.reset('');
    this.priceForm.controls['thirdPrice'].setValue('0')
    /* if(offering.offer_type == 'Floating') {

    } else {
    } */
    this.priceVal.next('')
    this.thirdPriceVal.next('')
    this.priceUSDVal = ''
    $('#offering_price_change').modal({backdrop: 'static'});
    
  }
  changePrice() {
    let data = {
      offering_order_id: this.currEditData.offering_order_id
    };
    if(this.currEditData.offer_type == 'Floating') {
      data['third_market_percent'] = Number(this.priceForm.value.thirdPrice);
    } else if(this.currEditData.offer_type == 'Fixed'){
      data['token_price'] = Number(this.priceForm.value.price)
    } else {
      data['fixed_price'] = Number(this.priceForm.value.price)
    }
    // if(this.priceForm.invalid)
    console.log('price val => ', this.priceForm.value);    
    this.isLoading = true;
    this.service.postApi('edit-offering-price', data, 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message);
        this.filter.search ? this.searchApi() : this.offeringListApi()
      } else {
        this.service.toastrErr(`Something went wrong`);
      }
      $('#offering_price_change').modal('hide');
    }, error => {
      this.isLoading = false
      this.service.toastrErr(`Something went wrong`);
      $('#offering_price_change').modal('hide');
    })
  }
  
  priceChangeApi() {
    let data = {};
    let url = '';
    if(this.currEditData.offer_type == 'Fixed') {
      url = 'fixed-usd';
      data = {
        ticker: this.currEditData.symbol_name,
        ticker_amount: Number(this.priceForm.value.price)
      }
      if(this.currEditData.payment_type === 2){
          data['fiat_currency'] =  this.currEditData.accepting_currency
      }
        
    } else if(this.currEditData.offer_type == 'Floating') {
      url = 'third-usd';
      data = {
        token_ticker: this.currEditData.token_ticker,
        currency_ticker: this.currEditData.symbol_name,
        spot_distance: Number(this.priceForm.value.thirdPrice)
      }
    } else if(this.currEditData.offer_type == 'Linked Token') {
      url = 'linked-ticker-usd'
      data = {
        token_ticker: this.currEditData.token_ticker,
        currency_ticker: this.currEditData.symbol_name,
        ticker_amount: Number(this.priceForm.value.price)
      }
     if(this.currEditData.payment_type === 2){
          data['fiat_currency'] =  this.currEditData.accepting_currency
      }
      
    } else if(this.currEditData.offer_type == 'Linked Currency') {
      url = 'linked-currency-usd'
      data = {
        token_ticker: this.currEditData.token_ticker,
        currency_ticker: this.currEditData.symbol_name,
        ticker_amount: Number(this.priceForm.value.price)
      }
    }
    this.isLoading = true;
    this.service.postApi(url, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.priceUSDVal = response.body.tickerInUsd
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`);
    })

    

  }

}
