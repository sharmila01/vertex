import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
import { MainService } from '../../../providers/mainService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

/* export class OfferType {
  name: string;
}

const OFFERS: OfferType[] = [
  { name: 'Fixed' },
  { name: 'Floating' },
  { name: 'Linked Project'},
  { name: 'Linked Currency'}
]; */
declare var $: any;

@Component({
  selector: 'app-in-add-offering',
  templateUrl: './in-add-offering.component.html',
  styleUrls: ['./in-add-offering.component.css']
})
export class InAddOfferingComponent implements OnInit {
  /* public showStyle: boolean = false;
    offers = OFFERS;
    selectedOfferType: OfferType; */
  public isLoading:boolean = true;
  addOfferingForm: FormGroup;
  startDateOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd'
  }
  endDateOptions: INgxMyDpOptions = {
    dateFormat: 'yyyy-mm-dd'
  }
  dateError: boolean = false;
  projectList: any = [];
  paymentTypes : any = [];
  symbolArr: any = [];
  currId: any = '';
  isShowPayment = false;
  isShowPay = true;
  isShowPays = false
  isRange: boolean;
  currencyName: any = '';
  currModalData: any = {eth_address: null};
  profileData: any ={};
  mouseHover: boolean = false;
  currencyCheck: any = {};
  priceVal = new Subject();
  thirdPriceVal = new Subject();
  priceUSDVal: any = '';
  currencyBlockChainName: any = '';
  bankUser :any = [];
  acceptCurrency : any =[];
  selectedPayments;
  cryptoCurrencyID;
  bankTransferID;
  acceptCurrencies;
  selectedToken;
  // addOffTooltip = {
  //   float: left;
  //   background-color: blue !important;
  // }
  // angularxQrCode: any = null;
  constructor(private fb: FormBuilder, private service: MainService, private route: ActivatedRoute, private router: Router, private config: NgbCarouselConfig) { }

  async ngOnInit() {
    this.getPaymentTypes();
    
    await this.getProjectApi()
    this.getBankingUser();
    this.config.interval = 100000000;
    let currDate = new Date()
    currDate.setDate(currDate.getDate() - 1)
    // this.startDateOptions.disableUntil = { year: new Date().getFullYear(), month: (new Date().getMonth() + 1), day: currDate.getDate() }
    this.endDateOptions.disableUntil = { year: currDate.getFullYear(), month: (currDate.getMonth() + 1), day: currDate.getDate() }
    this.addOfferingForm = this.fb.group({
      project: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      currency : [''],
      price: ['', Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,10})?$/)],
      thirdPrice: [''],
      paymentType:[null, Validators.required],
      symbol: [null, Validators.required ],
      // quantity: ['', Validators.compose([ Validators.required, Validators.pattern(/^(?=.*[1-9])\d{1,10}$/) ])],
      quantity: ['', Validators.compose([ Validators.required, Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,10})?$/) ])],
      // supply: ['', Validators.compose([ Validators.required, Validators.pattern(/^(?=.*[1-9])\d{1,10}$/) ])],
      hotAddress: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9,$#&^.@!/'-]*$/)])],
      // hotKey: ['', Validators.required],
      // coldAddress: ['', Validators.required]
      infiniteEnd: [false],
      tokenBurning: [false],
      offerType: ['', Validators.required]
    })
    console.clear()
    let params = this.route.snapshot.params
    console.log('params = > ', params['id'])
    
    // await this.getPlatformApi()
    this.currId = params['id']
    this.currId == 'add' ? '' :  this.offeringDetailApi()
    this.getProfileApi()

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
    // this.getPaymentTypes();
  }
  getProjectApi() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.service.getApi(`institutional-project`, 1).subscribe(response => {
        this.isLoading = false;
        console.log(response)
        if(response.status == 200) {
          this.projectList = response.body.data
          resolve(true)
        }
      }, error => {
        this.isLoading = false;
        this.service.toastrErr(`Something went wrong`)
      })
    })
    
  }
  getPlatformApi() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.service.getApi(`get-currency`, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.symbolArr = response.body.data;
          console.log('this.symbolArr1',this.symbolArr);
          resolve(true)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        this.isLoading = false;
        this.service.toastrErr(`Something went wrong`)
      })
    })
  }
  getProfileApi() {
    this.cryptoCurrencyID = localStorage.getItem("Cryptocurrency");
    this.bankTransferID = localStorage.getItem("bankTransfer");
    this.service.getApi(`profile`, 1).subscribe(response => {
       this.isLoading = false;
       if (response.status == 200) {
         let profileData = response.body.data;
         this.profileData = response.body.data;
       // console.log("Eth---->> ",this.ether);
       // console.log("BTC---->>>> ",this.btc);
       // console.log("stakeData.stake_address---->>>> ",stakeData.stake_address + "  stakeData.approved---->>>   ",stakeData.approved);
       // console.log("BTC---->>>> ",this.stake);
       } else {
         this.service.toastrErr(`Something went wrong`)
       }
     }, error => {
       this.isLoading = false
    
       if (error.status == 400) {
         this.service.toastrErr(error.error.message)
       } else {
         this.service.toastrErr(`Something went wrong`)
       }
     })
   }
   mouseHovering() {
    this.mouseHover = true;
   }

   mouseLeft() {
    this.mouseHover = false;
   }
   selectMyAddress(crncy = '') {
    let add = ''
      if(crncy == 'Ethereum') {
        add = this.profileData.eth_address || ''
        
      } else if(crncy == 'Bitcoin') {
        add = this.profileData.btc_address || ''
      }
      this.addOfferingForm.controls['hotAddress'].setValue(add)
     
   }
  

  get form() {
    return this.addOfferingForm.controls;
  }

  onStartDateChanged(event) {
    // console.log('date change')
    setTimeout(() => {
      let sd = this.addOfferingForm.value.startDate
      let ed = this.addOfferingForm.value.endDate
      // console.log(sd)
      // console.log(ed)
      if(sd && ed) {
        // console.log('both exist => ', this.addOfferingForm.value)
        if((new Date(sd.formatted).getTime()) >= (new Date(ed.formatted).getTime())) {
          this.dateError = true;
        } else {
          this.dateError = false;
        }
        // console.log('date end => ', this.dateError)
      }
      
    }, 300)

  }

  onInfiniteEnd() {
    
    if(this.addOfferingForm.value.infiniteEnd)
      this.dateError = false
    else 
      this.dateError = true
      // console.log('infinete end => ', this.dateError)
  }

  /* get isSameSupply() {
    let val = this.addOfferingForm.value
    if(val.quantity && val.supply) {
      return Number(val.quantity) > Number(val.supply) ? true : false;
    } else {
      return false;
    }
    
  } */

  onAddOffering() {
    console.log('add offering => ', this.addOfferingForm.getRawValue())
    // return;
    let formVal = this.addOfferingForm.getRawValue()
    
    let data = {
      project: formVal.project,
      start_date: formVal.startDate.formatted,
      token_for_sale: formVal.quantity,
      payout_address: formVal.hotAddress,
      is_infinite_end_date: formVal.infiniteEnd,
      payment_type : formVal.paymentType.id,
      is_bank_available : this.profileData.is_bank_available
    }
    if(formVal.infiniteEnd === false){
      data['end_date']= formVal.endDate.formatted 
    }
    if(formVal.paymentType.id == 1){
      data['symbol'] = formVal.symbol
    }
    else if(formVal.paymentType.id == 2) {
      data['accepting_currency'] = formVal.symbol
    }
    if(this.currencyName != 'BTC' && this.currencyName != 'ETH' && this.currencyName != 'USD' ) {
      data['token_burning'] = formVal.tokenBurning
    }
    if(data['token_burning']) {
      delete data['payout_address']
    }
    if(formVal.offerType == 'fixed') {
      data['offer_type'] = 'Fixed'
      data['token_price'] = Number(formVal.price)
    } else if(formVal.offerType == 'floating') {
      data['offer_type'] = 'Floating'
      data['third_market_percent'] = Number(formVal.thirdPrice)
    } else if(formVal.offerType == 'linkedToken') {
      data['offer_type'] = 'Linked Token'
      data['fixed_price'] = Number(formVal.price)
    } else if(formVal.offerType == 'linkedCurrency'){
      data['offer_type'] = 'Linked Currency'
      data['fixed_price'] = Number(formVal.price)
    }
    if(data['third_market_percent'] == 0) return;

    // console.log(data)
    let url = ``;
    if(this.currId == 'add') {
      url = `create-token`;
    } else {
      url = `institutional-edit`;
      data['id'] = this.currId
    }
    /* if(this.isRange) {
      data['third_market_percent'] = formVal.price
      data['token_price'] = 0.0
    } else 
      data['token_price'] = formVal.price */
      this.isLoading = true;
    this.service.postApi(url, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 201 || response.status == 200) {
        this.service.toastrSucc(response.body.message)
        // window.history.back()
        // this.angularxQrCode = response.body['QR-data'].eth_address
        let item = response.body['QR-data']
        // this.currModalData = Object.assign({}, { qr: item.adress_for_pay, eth: item.eth_pay,  token: item.token_pay, token_name: item.token_name, id_for_pay: item.id_for_pay, ticker: item.ticker, btc_pay: item.btc_pay })
        this.currModalData = Object.assign({}, { eth_address: item.eth_address, eth: item.eth_pay,  token: item.token_pay, token_name: item.ticker, id: item.id, ticker: item.fund_ticker, btc_pay: item.btc_pay })
        $('#add_offering_modal').modal({backdrop: 'static'})   
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 404 || error.status == 400)
        this.service.toastrErr(error.error.message)
      else 
        this.service.toastrErr('Something went wrong')
    })

  }
  goBack() {
    window.history.back()
  }
  closeModalAndBack() {
    $(`#add_offering_modal`).modal('hide')
    window.history.back()
  }
  copyToClipboard(text) {
    this.service.copyToClipboard(text);
  }
  

  offeringDetailApi() {
    let data = {
      offering_id: this.currId
    }
    this.isLoading = true;
    this.service.postApi(`institutional-details`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status = 200) {
        if(response.body.data.length) {
          let offDet = response.body.data[0]
          this.addOfferingForm.patchValue({
            project: offDet.project,
            startDate: {
              formatted: offDet.start_date,
              date: {
                year: Number(offDet.start_date.split('-')[0]),
                month: Number(offDet.start_date.split('-')[1]),
                day: Number(offDet.start_date.split('-')[2])
              }
            },
            endDate: {
              formatted: offDet.end_date,
              date: {
                year: Number(offDet.end_date.split('-')[0]),
                month: Number(offDet.end_date.split('-')[1]),
                day: Number(offDet.end_date.split('-')[2])
              }
            },
            symbol: offDet.symbol,
            quantity: offDet.token_for_sale,
            hotAddress: offDet.payout_address || '',
            infiniteEnd: offDet.is_infinite_end_date,
            tokenBurning: offDet.token_burning || false
          })
          if(offDet.infiniteEnd) {
            this.addOfferingForm.patchValue({
              endDate: {
                formatted: null
                // date: {
                //   year: Number(offDet.end_date.split('-')[0]),
                //   month: Number(offDet.end_date.split('-')[1]),
                //   day: Number(offDet.end_date.split('-')[2])
                // }
              },
            })
          }
          this.symbolChange()

          
          let arr = this.projectList.filter(x =>  x.id == offDet.project )[0]
          console.log(arr)
          this.isRange = arr.third_market
          /* this.isRange ? this.addOfferingForm.controls['price'].setValue(offDet.third_market_percent) : this.addOfferingForm.controls['price'].setValue(offDet.token_price) */
          if(this.isRange) {
            this.addOfferingForm.controls['price'].clearValidators()
            this.addOfferingForm.controls['price'].updateValueAndValidity()
            this.addOfferingForm.controls['price'].setValue(offDet.third_market_percent)
          } else {
            
            this.addOfferingForm.controls['price'].setValidators([Validators.required, Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,10})?$/)])
            this.addOfferingForm.controls['price'].updateValueAndValidity()
            this.addOfferingForm.controls['price'].setValue(offDet.token_price)
      
          }
          if(offDet.is_approved) {
            // let form = this.addOfferingForm.controls
            this.addOfferingForm.controls['project'].disable()
            this.addOfferingForm.controls['startDate'].disable()
            this.addOfferingForm.controls['endDate'].disable()
            this.addOfferingForm.controls['price'].disable()
            this.addOfferingForm.controls['symbol'].disable()
            this.addOfferingForm.controls['quantity'].disable()
            this.addOfferingForm.controls['infiniteEnd'].disable()
          }
          // console.log('form =>', this.addOfferingForm.getRawValue())
          if(this.isRange) {
            setTimeout(() => {
              this.onChangeRange()
            }, 100)
            
          }
          /* if(arr.length)
            this.offDet.projectName = arr[0].token_name */
        }
          
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }

  onChangeRange() {
    console.log('range change')
    let el = $("input[type='range']");
    let el1 = $("output");
    let val = this.addOfferingForm.controls['thirdPrice'].value
    // let offset = -20;
    // let percent = val / 60;
    // let pos = percent * (400 + offset) - 40;
    // el
    //  .next("output").css({
    //    left: pos+ 428//pos+ 248
    //  })
    // let  newPoint = (val - 0) / (30 - 0);
    if(window.innerWidth > 320 && window.innerWidth < 768) {
      // let elem = <any>document.getElementById('idsad')
    //   console.log(elem)
    //   console.log(elem.offsetWidth, elem.valueAsNumber, elem.offsetParent.offsetWidth )
    //   var off = elem.offsetWidth / (60);
    // var px =  ((elem.valueAsNumber) * off) - (elem.offsetParent.offsetWidth / 2);
    // console.log(px)
    //   el
    //  .next("output").css({
    //    left: pos //pos+ 248
    //  })
    } else {
      

      let offset = -20;
      let percent = val / 60;
      let pos = percent * (400 + offset) - 40;
      el
       .next("output").css({
         left: pos + 428//pos+ 248
       })
      
    }
    
    // let width = el.width();
    // console.log('width => ', width)
    
    // console.log(e)
    // console.log(e.target.offsetWidth)
    
     //percent * (400 + offset)-40
    // console.log(pos, percent)
    // console.log(val)
    // console.log(el.attr("min"))
    
    // console.log('pos => ', pos+ 248)
    // console.log(Number (newPoint*1000/3) + 228)
    // let  newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
    // console.log('newpoint => ', newPoint)
   

  }

  onChangeToken() {
    let data = this.addOfferingForm.controls['project'];
    let val = this.addOfferingForm.controls['project'].value;
    let val1 = this.addOfferingForm.controls['symbol'].value;
    
    console.log(val)
    /* if(val) {
      let thirdMarket = this.projectList.filter(x => x.id == val)[0].third_market
      console.log(thirdMarket)
      this.isRange = thirdMarket;
      
      if(this.isRange) {
        this.addOfferingForm.controls['price'].reset('1')
        this.addOfferingForm.controls['price'].clearValidators()
        this.addOfferingForm.controls['price'].updateValueAndValidity()
      } else {
        this.addOfferingForm.controls['price'].reset('')
        this.addOfferingForm.controls['price'].setValidators([Validators.required, Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,10})?$/)])
        this.addOfferingForm.controls['price'].updateValueAndValidity()

      }
    } */
    if(val && val1) {
      this.currencyCheckApi(1)
    }
    
  }

  currencyCheckApi(val) {
    let arr = this.projectList.filter(x => x.id == this.addOfferingForm.controls['project'].value)
    let arr1 = this.symbolArr.filter(x => x.id == this.addOfferingForm.controls['symbol'].value)
    if(arr[0].ticker == arr1[0].platform_currency_ticker) {
      this.service.toastrErr(`You can't select same token and payment currency`)
      if(val == 2)
        this.addOfferingForm.controls['symbol'].setValue(null)
      else  this.addOfferingForm.controls['project'].setValue(null)
      return;
    }
    let data = {
      project_ticker: arr[0].ticker,
      currency_ticker: arr1[0].platform_currency_ticker
    }
    // console.log('all project +====>> ', this.projectList)
    // console.log('all symbolArr +====>> ', this.symbolArr)
    // console.log(this.addOfferingForm.controls['project'].value, this.addOfferingForm.controls['symbol'].value)
    this.isLoading = true;
    this.service.postApi(`currency-check`, data, 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        // console.log(response.body.currency_ticker)
        // console.log(response.body.project_ticker)
        this.currencyCheck = response.body
        this.addOfferingForm.controls['offerType'].setValue('')
      } else {
        this.service.toastrErr(`Something went wrong`);
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`);
    })
  }
  /* displayValue (e) {
    console.log('change slider')
    var span = document.querySelector('#val');
    const slide = document.querySelector('#slide');
    const button = document.querySelector('#limitButton');
    const inp = e.target || this;
    const value = +inp.value;
    const min = inp.min;
    const max = inp.max;
    const width = inp.offsetWidth;
    const offset = -20;
    const percent = (value - min) / (max - min);
    const pos = percent * (width + offset) - 40;
    // span.style.left = `${pos}px`;
    $('#val').css({'left': `${pos}px`})
    span.innerHTML = value.toString();
  } */

  symbolChange() {
    let arr = this.symbolArr.filter(x => x.id == this.addOfferingForm.value.symbol)
    if(arr.length)  this.currencyName = arr[0].platform_currency_ticker
    if(arr.length)  this.currencyBlockChainName = arr[0].blockchain_platform || ''
    let val = this.addOfferingForm.controls['project'].value
    let val1 = this.addOfferingForm.controls['symbol'].value
    if(val && val1) {
      this.currencyCheckApi(2)
    }
  }

  acceptingCurrencyChange() {
    let arr = this.symbolArr.filter(x => x.id == this.addOfferingForm.value.currency)
    if(arr.length)  this.currencyName = arr[0].payment_type_name
    if(arr.length)  this.currencyBlockChainName = arr[0].blockchain_platform || ''
    let val = this.addOfferingForm.controls['project'].value
    let val1 = this.addOfferingForm.controls['symbol'].value
    if(val && val1) {
      this.currencyCheckApi(2)
    }
  }
  changePaymentCurr() {
    console.log('payment curr val ====>>>>>> ', this.addOfferingForm.value.symbol) 
  }

  selectBurning() {
    console.log(this.addOfferingForm.value.tokenBurning)
    if(this.addOfferingForm.value.tokenBurning) {
      this.addOfferingForm.controls['hotAddress'].clearValidators()
      this.addOfferingForm.controls['hotAddress'].updateValueAndValidity()
      this.addOfferingForm.controls['hotAddress'].setValue('')
    } else {
      this.addOfferingForm.controls['hotAddress'].reset('')
      this.addOfferingForm.controls['hotAddress'].setValidators([Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9,$#&^.@!/'-]*$/)])
      this.addOfferingForm.controls['hotAddress'].updateValueAndValidity()
    }
  }

  changeOfferType(val) {
    this.addOfferingForm.controls['offerType'].setValue(val)
    console.log(this.addOfferingForm.value.offerType);
    // this.addOfferingForm.controls['price'].setValue('')
    // this.addOfferingForm.controls['thirdPrice'].setValue('0')
    
    let offerType = this.addOfferingForm.value.offerType
    if(offerType == 'fixed' || offerType == 'linkedToken' || offerType == 'linkedCurrency') {
      console.log('price val offertype selected')
      this.addOfferingForm.controls['price'].reset('')
      this.addOfferingForm.controls['price'].setValidators([Validators.required, Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,10})?$/) ])
      this.addOfferingForm.controls['price'].updateValueAndValidity()
      this.addOfferingForm.controls['thirdPrice'].clearValidators()
      this.addOfferingForm.controls['thirdPrice'].updateValueAndValidity()
      this.addOfferingForm.controls['thirdPrice'].setValue('0')
    } else if(offerType == 'floating') {
      console.log('floating offertype selected')
      this.addOfferingForm.controls['thirdPrice'].reset('0')
      this.addOfferingForm.controls['thirdPrice'].setValidators([Validators.required])
      this.addOfferingForm.controls['thirdPrice'].updateValueAndValidity()
      this.addOfferingForm.controls['price'].clearValidators()
      this.addOfferingForm.controls['price'].updateValueAndValidity()
      this.addOfferingForm.controls['price'].setValue('')
    }
    this.priceVal.next('')
    this.thirdPriceVal.next('')
    this.priceUSDVal = ''
   
    
  }
  priceChangeApi() {
    console.log(`price Chnage api =>> `, this.addOfferingForm.value)
    let arr = this.projectList.filter(x => x.id == this.addOfferingForm.controls['project'].value)
    let arr1 = this.symbolArr.filter(x => x.id == this.addOfferingForm.controls['symbol'].value)
    // project_ticker: arr[0].ticker,
    //   currency_ticker: arr1[0].platform_currency_ticker
    this.isLoading = true;
    let formValue =  this.addOfferingForm.value
    let data = {}
    let url = '';
    let formVal = this.addOfferingForm.getRawValue()
    if(formValue.offerType == 'fixed') {
      url = 'fixed-usd';
      data = {
        ticker_amount: Number(formValue.price)
      }
      if(formVal.paymentType.id === 1){
        data['ticker'] =  arr1[0].platform_currency_ticker
      }
      else if(formVal.paymentType.id === 2){
          data['fiat_currency'] =  this.acceptCurrencies.currency_code,
          data['ticker'] =  arr1[0].currency_code
      }
    } else if(formValue.offerType == 'floating') {
      url = 'third-usd';
      data = {
        token_ticker: arr[0].ticker,
        currency_ticker: arr1[0].platform_currency_ticker,
        spot_distance: Number(formValue.thirdPrice)
      }
    } else if(formValue.offerType == 'linkedToken') {
      url = 'linked-ticker-usd'
      data = {
        token_ticker: arr[0].ticker,
        currency_ticker: arr1[0].platform_currency_ticker,
        ticker_amount: Number(formValue.price)
      }
      if(formVal.paymentType.id === 1){
        data['currency_ticker'] =  arr1[0].platform_currency_ticker
      }
      else if(formVal.paymentType.id === 2){
          data['fiat_currency'] =  this.acceptCurrencies.currency_code,
          data['ticker'] =  arr1[0].currency_code
      }
    } else if(formValue.offerType == 'linkedCurrency') {
      url = 'linked-currency-usd'
      data = {
        token_ticker: arr[0].ticker,
        currency_ticker: arr1[0].platform_currency_ticker,
        ticker_amount: Number(formValue.price)
      }
    }
    this.service.postApi(url, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.priceUSDVal = response.body.tickerInUsd
      } else {
        this.service.toastrErr(`Something went wrong`);
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }

  /* onSelect(type: OfferType): void {
    this.showStyle = true;
    this.selectedOfferType = type;
} */

  getStyle(type) {
    if (type === this.addOfferingForm.value.offerType) {
        return "#008000ad";
    } else {
        return "";
    }
  }

getStyleColor(type) {
  if (type === this.addOfferingForm.value.offerType) {
      return "#fff";
  } else {
      return "";
  }
}

getAcceptedFiatCurrency() {
  this.isLoading = true;
  this.service.getApi(`accepted-fiat-currency`, 1).subscribe(response => {
    console.log('response', response)
    this.isLoading = false;
    if (response.status == 200) {
      let symbolArrs = response.body.data;
      this.symbolArr = symbolArrs.filter(
        res => res.id === this.acceptCurrency);
    } else {
      this.service.toastrErr(`Something went wrong`)
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

getSelectedPaymentTypes(item){
  this.selectedPayments = item;
  
 if(item.payment_type_name === 'Cryptocurrency'){
   this.isShowPayment = true;
   this.isShowPay = true;
   this.isShowPays = false;
   this.getPlatformApi();
 }
 else if(item.payment_type_name === 'Bank Transfer'){
  this.isShowPayment = false;
  this.isShowPays = true;
  this.isShowPay = false;
  this.getAcceptedFiatCurrency();
}

}

getSelectedCurrency(item){
  this.acceptCurrencies = item;
}
  

getBankingUser() {
  return new Promise((resolve, reject) => {
    this.isLoading = true;
    this.service.getApi(`user-bank-details`, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.acceptCurrency = response.body.data.accepting_fiat_currency;
        resolve(true)
      } else {
        // this.service.toastrErr(`Something went wrong`);
      }
    }, error => {
      this.isLoading = false;
      // this.service.toastrErr(`Something went wrong`)
    })
  })
}
getSelectedToken(item){
  this.selectedToken  = item.platform_symbol;

}
getPaymentTypes() {
  return new Promise((resolve, reject) => {
    this.isLoading = true;
    this.service.getApi(`payment-types`, 0).subscribe(response => {
      console.log(response)
      this.isLoading = false;
      if (response.status == 200) {
        let paymentTypes = response.body.data;
        paymentTypes.forEach(p => {

          if (p.payment_type_name === 'Cryptocurrency'){
            localStorage.setItem("Cryptocurrency", p.id);
            this.cryptoCurrencyID = localStorage.getItem("Cryptocurrency");
          }
           
          else if (p.payment_type_name === 'Bank Transfer'){
            localStorage.setItem("bankTransfer", p.id);
            this.bankTransferID = localStorage.getItem("bankTransfer");

          }
            
          else {
            localStorage.setItem("creditCard", p.id);
          }
          console.log(p);
        });
        resolve(true)
      }
    }, error => {
      this.isLoading = false;

    })
  })

}
}