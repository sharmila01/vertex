import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../providers/mainService.service';
import { SeoService } from '../../providers/seo.service';
import { AppComponent } from '../../app.component';
declare var $: any;


@Component({
  selector: 'app-token-sale',
  templateUrl: './token-sale.component.html',
  styleUrls: ['./token-sale.component.css']
})
export class TokenSaleComponent implements OnInit {
  public filter = false;
  searchSeletedSpend: string;
  public key: string;
  public OrderBy: string;
  public reverse: boolean = false;
  model: any = {
    onColor: 'warning',
    offColor: 'secondary',
    onText: 'Offerings',
    offText: 'Projects',
    disabled: false,
    size: '',
    value: false
  };
  tokenValue: any = 0;
  calculatorprice: any;
  offerings: any = [];
  isLoggedIn: boolean = false;
  isLoggedOut: boolean = false;
  specialOff: boolean = false;
  iswebApp: boolean = true;
  public isLoading: boolean = true;
  private totalRecords = 0;
  public searchSeletedData;
  calculationOffer;
  tokenPrice;
  totalProjects = 0;
  projectsLimit = 9;
  totalOfferings = 0;
  offeringLimit = 0;
  currencyOfName;
  newId: any = '';
  tab: any = 'all';
  blockError;
  platformListArr = [];
  public showFilter = true;
  public timer;
  tokenData:any ={};
  ongoingTokenDet: any = { 'docs': [], 'paginationData': {}, 'currPage': 1 };
  upcomingTokenDet: any = { 'docs': [], 'paginationData': {}, 'currPage': 1 };
  allTokenDet: any = { 'docs': [], 'paginationData': {}, 'currPage': 1 };
  tokenCount: any = { 'ongoing': 0, 'upcoming': 0 };
  searchToken: any;
  public isProjects: boolean = true;
  public isOfferings: boolean = false;
  searcNameOrTicker;
  searcNameOrTickerForSpend;
  isToken: boolean = false;
  cryptoCurrencyID;
  bankTransferID;
  public selectedFiatCurrency;

  constructor(private router: Router, private route: ActivatedRoute, private service: MainService, private seo: SeoService, private app: AppComponent) {
    window.scrollTo(0, 0)
    this.key = 'token_name';
    this.OrderBy = 'True';
  }
  public searchData = {
    "name": "",
    "platform": "",
    "type": ""
  }
  ngOnInit() {
    this.getPaymentTypes();
    this.seo.generateTags({
      title: 'Vertex Market | OTC Digital Assets | Aftermarket',
      description: 'Vertex Market is a secondary market OTC Trading Platform for digital assets such as Utility Tokens, Security Tokens and Stable Coins as well as for major cryptocurrencies such as Bitcoin, Ethereum, Monero and others. Vertex provides comprehensive information about ICO and other blockchain related projects.'
    });
    
    this.searcNameOrTicker = localStorage.getItem('searcNameOrTicker');
    this.searcNameOrTickerForSpend = localStorage.getItem('searcNameOrTickerForSpend');
    this.searchSeletedSpend = localStorage.getItem("searchSelectedSpend");
    this.selectedFiatCurrency = localStorage.getItem('selectedFiatCurrency');
    

    if (this.searcNameOrTicker) {
      this.searchData.name = '';
    } else {
      this.searchData.name = "";
      this.tokenSaleApi();
    }

    this.getLoggedin();
    if (localStorage.getItem('selectedBuytoken') == 'true') {
      this.model.value = true;
    }
    this.route.params.subscribe(params => {
      console.log('params => ', params)
      this.tab = params[`tab`]
      this.allTokenDet = { 'docs': [], 'paginationData': {}, 'currPage': 1 };
      this.ongoingTokenDet = { 'docs': [], 'paginationData': {}, 'currPage': 1 };
      this.upcomingTokenDet = { 'docs': [], 'paginationData': {}, 'currPage': 1 };

      if (this.searchSeletedSpend) {
        this.searchSpend();
      } else {
        this.offeringList();
      }
      this.tokenSaleApi();
      this.getPlatform();
      this.getScreenSize();

    })
  }
  ngOnDestroy() {
    localStorage.removeItem('searchSelectedSpend');
    this.searchSeletedSpend='';
    localStorage.setItem('selectedBuytoken', 'false');
    localStorage.removeItem('searcNameOrTicker');
    localStorage.removeItem('searcNameOrTickerForSpend');
  }
  //------------ Search ------------------------------
  search() {
    this.tokenSaleApi();

    this.offeringList();
  }

  public toggleSearch(event: any) {
    this.filter = (this.filter == true) ? false : true;
    // const dom: any = document.querySelector('.line');
    // dom.classList.toggle('searchHide');

  }

  getLoggedin() {
    if (localStorage.getItem('isloggedin') == "true") {
      this.isLoggedIn = true;
    }
    else if (localStorage.getItem('isloggedin') == "false") {
      this.isLoggedOut = true;
      this.isLoggedIn = false;
    }

  }
  // ------------------- Token Sale Api --------------------
  // ***************** Token Sale Api *****************
  tokenSaleApi() {
    this.cryptoCurrencyID = localStorage.getItem("Cryptocurrency");
    this.bankTransferID = localStorage.getItem("bankTransfer");
    let tokenData = {};
    // if (this.tab === `all`)
    tokenData = { "sale_type": this.tab, "page": this.allTokenDet.currPage, "search": "True", "nameOrticker": this.searchData.name, "platform": this.searchData.platform, "type": this.searchData.type }
    // else if (this.tab === `upcoming`)
    //   tokenData = { "sale_type": "no-offering", "page": this.upcomingTokenDet.currPage, "search": "True", "nameOrticker": this.searchData.name,  "platform": this.searchData.platform, "type": this.searchData.type }
    // else if (this.tab === `ongoing`)
    //   tokenData = { "sale_type": this.tab, "page": this.ongoingTokenDet.currPage, "search": "True", "nameOrticker": this.searchData.name,  "platform": this.searchData.platform, "type": this.searchData.type }
    this.isLoading = true;
    this.service.postApi(`project-list`, tokenData, 0).subscribe(response => {


      this.totalRecords = response.body.pagination_data;
      this.totalProjects = response.body.pagination_data.total;
      this.timer = response.body.timer;
      this.isLoading = false;
      if (response.status == 200) {
        this.tokenCount = response.body.count

        // if (this.tab === `ongoing`) {
        //   this.ongoingTokenDet.docs = response.body.token

        //   this.ongoingTokenDet.paginationData = response.body.pagination_data
        //   for (let item of this.ongoingTokenDet.docs) {

        //     item.remTime = "Ongoing";            
        //   }

        // } else if (this.tab === `upcoming`) {
        //   this.upcomingTokenDet.docs = response.body.token
        //   this.upcomingTokenDet.paginationData = response.body.pagination_data

        // } else if (this.tab === `all`) {
        this.allTokenDet.docs = response.body.token;
        let timer = response.body.timer;
        this.allTokenDet.paginationData = response.body.pagination_data
        for (let item of this.allTokenDet.docs) {
          var startDate = timer[item.ticker];
          if (startDate !== undefined) {
            item.start_date = startDate;
          }
        }
        this.calculateRemTime(this.allTokenDet.docs)
        setInterval(() => {
          this.calculateRemTime(this.allTokenDet.docs)
        }, 1000)

        // }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if (error.status == 400) {
        this.allTokenDet = { 'docs': [], 'paginationData': {}, 'currPage': 1 };
        this.ongoingTokenDet = { 'docs': [], 'paginationData': {}, 'currPage': 1 };
        this.upcomingTokenDet = { 'docs': [], 'paginationData': {}, 'currPage': 1 };
      } else {
        this.
          service.toastrErr(`Something went wrong`)
      }
    })
    // if(this.searchSeletedSpend) {
    //   this.searchSpend();      
    // }

    // else {
    //   this.offeringList();
    // }
  }
  // **************** End Token Sale Api **********************

  // ************** Calculate Start Time *********************
  calculateRemTime(arr) {
    for (let item of arr) {
      if (item.start_date) {
        if (item.start_date == 'Ongoing') {
          item.remTime = "Ongoing"
        } else {
          let closeDate = new Date(item.start_date).getTime();
          let now = new Date().getTime();
          let distance = closeDate - now;
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
            item.remTime = "Ongoing"
          } else {
            item.remTime = `${days} dd, ${hours} hh, ${minutes} mm, ${seconds} ss`
          }
        }

      } else {
        item.remTime = 'Offerings not available'
      }


    }
  }
  // -------------- End Calculate Start Time ----------------------
  // ------------------ Pagination -------------------------
  changePage(page) {
    if (this.tab === `all`) {
      this.allTokenDet.currPage = page
    } else if (this.tab === `ongoing`) {
      this.ongoingTokenDet.currPage = page
    } else if (this.tab === `upcoming`) {
      this.upcomingTokenDet.currPage = page
    }
    this.tokenSaleApi();
  }


  // ----------------End Pagination -----------------
  goToTradingDetail(data) {
    this.router.navigate([`/token-information`, `${data.token_name.toString()}-${data.ticker.toString()}`])
  }

  gotoTokenDetail(data){
    this.router.navigate([`/token-information`, `${data.token_name.toString()}-${data.token_ticker.toString()}`])
  }
  toggle(val) {
    console.log(val)
    this.router.navigate([`/token-sale`, val])
  }

  public reset() {
    this.searchData = {
      "name": "",
      "platform": "",
      "type": ""
    }
    // this.tokenSaleApi();
  }

  getPlatform() {
    this.service.getApi(`get-platform`, 0).subscribe(response => {
      console.log('response', response);
      this.platformListArr = response.body.data;
    }, error => {
      this.service.toastrErr(`Something went wrong`)
    })
  }

  projectsPaginationChanged(event: any): void {
    console.log(event)
    if (this.tab === `all`) {
      this.allTokenDet.currPage = event.page
    } else if (this.tab === `upcoming`) {
      this.upcomingTokenDet.currPage = event.page
    } else if (this.tab === `ongoing`) {
      this.ongoingTokenDet.currPage = event.page
    }
    this.tokenSaleApi()
  }

  getScreenSize() {
    this.iswebApp = true;
    let mobWidth = (window.screen.width)
    if (mobWidth < 1000) {
      this.iswebApp = false;
    }
  }

  listProjects() {
    this.isProjects = true;
    this.isOfferings = false;
  }

  listOfferings() {
    this.isProjects = false;
    this.isOfferings = true;
  }

  toggleChange(val) {
    if (val == true) {
      this.isProjects = false;
      this.isOfferings = true;
    }
    else {
      this.isOfferings = false;
      this.isProjects = true;
    }
  }

  //sort based on the header selection
  sorting(key) {
    
    this.key = key;
    this.key = key;
    // this.OrderBy = this.reverse ? 'True' : 'False';
    this.reverse = !this.reverse;
    this.OrderBy = this.reverse ? 'True' : 'False';
    if (this.reverse) {
      if (this.searchSeletedSpend) {
        this.searchSpendSorting();
      }
      else {
        this.sortingOffering();
      }

    }
    else if (!this.reverse) {
      if (this.searchSeletedSpend) {
        this.searchSpend();

      } else {
        this.offeringList();
      }

      // this.searchSpend();
    }

  }




  offeringList() {
    this.searchSeletedSpend='';
    let tokenData = {
      "ordering": "False",
      "page": 1,
      "search": "True",
      "type": this.searchData.type,
      "nameOrticker": this.searchData.name,
      "symbol": this.searchData.platform
    };

    this.isLoading = true;
    this.service.postApi(`ongoing-offering-list`, tokenData, 0).subscribe(response => {
      console.log('offering', response)
      this.isLoading = false;
      this.offerings = response.body.token;
      this.totalOfferings = response.body.pagination_data.total;
      this.offeringLimit = response.body.pagination_data.limit;
    }, error => {
      this.isLoading = false;
    })
  }
  sortingOffering() {
    let tokenData = {
      "page": 1,
      // "ordering": "True",
      "ordering": this.OrderBy,
      // "ordering_on":"project__ticker,offer_type,start_date,end_date,token_price,token_for_sale ",
      "ordering_on": this.key,
      "search": "True",
      "type": this.searchData.type,
      "nameOrticker": this.searchData.name,
      "symbol": this.searchData.platform
    };
    this.isLoading = true;
    this.service.postApi(`ongoing-offering-list`, tokenData, 0).subscribe(response => {
      console.log('offering', response)
      this.isLoading = false;
      this.offerings = response.body.token;
      this.totalOfferings = response.body.pagination_data.total;
      this.offeringLimit = response.body.pagination_data.limit;
    }, error => {
      this.isLoading = false;
    })
  }

  openModal(offer) {
    $(`#calculation`).modal(`show`);
    this.calculationOffer = offer;
    // this.currencyOfName = offer.symbol_name;
    if(offer.payment_type == this.cryptoCurrencyID){
      this.currencyOfName = offer.symbol_name;
    }else if(offer.payment_type == this.bankTransferID){
      this.currencyOfName = offer.accepting_currency;
    }
    this.tokenValue = 0;
    this.tokenPrice = 0;
    this.calculatorprice = 0;

  }
  getAvailableToken(amount) {
    if (amount < 10) {
      return amount;
    }
    return amount.toFixed();
  }
  changeCalculatorValue(event) {
    console.log('event => ', event);
    this.tokenValue = event;
    this.tokenPrice = this.calculationOffer.token_price;
    this.calculatePrice(this.tokenValue, this.calculationOffer)
  }


  calculatePrice(buyValue, offer) {
    // 
    let data = {
      amount: offer.token_price * buyValue,
      symbol: offer.ticker,
      is_login: this.isLoggedIn
    }
    this.service.postApi(`calculate-total-price`, data, 0).subscribe(response => {
      console.log('calculate-total-price', response)
      this.calculatorprice = response.body;

    }, error => {
      this.service.toastrErr(`Something went wrong`)
    })
  }


  openModals(offer) {
    $(`#calculation`).modal(`show`);
    this.calculationOffer = offer;
    // this.currencyOfName = offer.symbol_name;
    if(offer.payment_type == this.cryptoCurrencyID){
      this.currencyOfName = offer.symbol_name;
    }else if(offer.payment_type == this.bankTransferID){
      this.currencyOfName = offer.accepting_currency;
    }
    this.tokenValue = 0;
    this.tokenPrice = 0;
    this.calculatorprice = 0;

  }

  buyToken(item) {
    // this.newId = item.id
    // $(`#buyTokenModal`).modal(`show`)
    if(this.app.pendingTradeData.length) {
      $(`#blockUser`).modal(`show`);
      this.blockError = "You have a pending trade so you can't buy token."
    } else {
      this.newId = item.id
      $(`#buyTokenModal`).modal(`show`);
    }
  }


  confirmBuy() {
    $(`#buyTokenModal`).modal(`hide`);
    if (localStorage.getItem('isloggedin') == "true") {
      this.buyTokenDetailApi();
    }
    else {
      this.router.navigate([`/vertex/login`])
    }
  }

  buyTokenDetailApi() {
    let data = { "id": this.newId }
    this.isLoading = true;
    this.service.postApi(`buy-token-detail`, data, 1).subscribe(response => {
      this.tokenData = response.body.token;
      this.isLoading = false;
      if (response.status == 200) {
        this.service.buyTokenAlready = Object.assign({}, response.body)
        this.router.navigate([`/buy-token`, this.newId, btoa('no'),this.tokenData.payment_type])
      } else {
        this.service.buyTokenAlready = {};
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.service.buyTokenAlready = {};
      this.isLoading = false;
      if (error.status == 400) {
        $(`#blockUser`).modal(`show`);
        this.blockError = error.error.message;
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }

  searchSpendSorting() {
    let spendData = {
      
      "search": this.searchSeletedSpend,
      "page": 1,
      // "ordering": "True",
      // "ordering_on": "project__token_name"
      "ordering": this.OrderBy,
      "ordering_on": this.key
    }
    this.service.postApi(`want-to-spend`, spendData, 0).subscribe(response => {
      this.model.value = true;
      this.offerings = response.body.data;

      this.totalOfferings = response.body.pagination_data.total;
      this.offeringLimit = response.body.pagination_data.limit;
    },
      error => {
        this.service.toastrErr(`Something went wrong`)
      })
  }


  searchSpend() {
    let spendData = {
      "search": this.searchSeletedSpend,
      "page": 1,
      "ordering": "False",
    }
    if(this.selectedFiatCurrency == 'false'){
      spendData["is_fiat_currency"] = false;
    }else if(this.selectedFiatCurrency == 'true'){
      spendData["is_fiat_currency"] = true;
    }
    this.service.postApi(`want-to-spend`, spendData, 0).subscribe(response => {
      this.model.value = true;
      this.offerings = response.body.data;

      this.totalOfferings = response.body.pagination_data.total;
      this.offeringLimit = response.body.pagination_data.limit;
    },
      error => {
        this.service.toastrErr(`Something went wrong`)
      })
  }

  offersPaginationChanged(event): void {
    let tokenData = {
      "page": event.page, "ordering": "False", "search": "True",
      "type": this.searchData.type,
      "nameOrticker": this.searchData.name,
      "symbol": this.searchData.platform
    };
    this.isLoading = true;
    this.service.postApi(`ongoing-offering-list`, tokenData, 0).subscribe(response => {
      console.log('offering', response)
      this.isLoading = false;
      this.offerings = response.body.token;
      this.totalOfferings = response.body.pagination_data.total;
      this.offeringLimit = response.body.pagination_data.limit;
    }, error => {
      this.isLoading = false;
    })
  }
  getPercentTokenSale(offer) {
    if (offer) {
      return +(offer.available_amount * 100 / offer.initial_supply).toFixed(1);
    } else {
      return '';
    }
  }

  getPercentTokenSales(offer) {
    if (offer) {
      return +(offer.token_for_sale * 100 / offer.initial_supply).toFixed(1);
    } else {
      return '';
    }
  }

  getPaymentTypes() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.service.getApi(`payment-types`, 0).subscribe(response => {
        console.log(response);
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
