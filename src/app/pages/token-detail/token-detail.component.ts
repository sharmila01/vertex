import { Component, OnInit, ElementRef, ViewChild, OnChanges, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../providers/mainService.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { NgxCarousel } from 'ngx-carousel';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { Title } from '@angular/platform-browser';
import { SeoService } from '../../providers/seo.service';
import { AppComponent } from '../../app.component';
declare var $: any;


@Component({
  selector: 'app-token-detail',
  templateUrl: './token-detail.component.html',
  styleUrls: ['./token-detail.component.css'],
})
export class TokenDetailComponent implements OnInit {
  newsFeed_ticket: string;
  blockError;
  tokenData1: any = {};
  payment_type;
  iswebApp: boolean = true;
  isLoggedin: boolean = false;
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  textCount: number;
  textCountDisplay: number;
  totalComments: 0;
  public isLoading: boolean = true;
  captchaToken: any = '';
  public news: any[];
  public newdate;
  calculationOffer;
  tokenPrice;
  private totalRecords = 0;
  private sortTableData = [];
  private displayData = [];
  private itemsPerPage: 10;
  private isResetCurrentPage: boolean = false;
  private filter: any;
  private pageNo: number;
  private page: number;
  showMore = false;
  currId: any = ``;
  tokenDet: any = { offering_type: [] };
  newUrl: any = ``;
  mainTokenName: any = ''
  offering: any = [];
  showLess = true;
  showPagin = false;
  private key: string;
  private OrderBy: string;
  public reverse: boolean = false;
  totalOffering = 0;
  commentLimit = 1;
  newId: any = ''
  comments: any;
  calculatorprice: any;
  tokenValue: any = 0;
  public linkValidation: boolean = false;
  keywords: any = [];
  gallerydata: any = [];
  public state = 'void';
  currencyOfName;
  cryptoCurrencyID;
  public disableSliderButtons: boolean = false;
  public commentData = {
    "project": "",
    "title": "",
    "comment": ""
  }

  public _album: any = [];
  public gallery: any = [];
  marketPrice: any = {};
  bankTransferID;
  public carouselTileItems: Array<any>;
  public carouselTile: NgxCarousel;
  constructor(private router: Router, private route: ActivatedRoute, private service: MainService,
    private sanitizer: DomSanitizer, private hostElement: ElementRef, private _lightbox: Lightbox,
    private _lighboxConfig: LightboxConfig, private titleService: Title, private seo: SeoService,
    private app: AppComponent
  ) {
    window.scrollTo(0, 0)
    this.newdate = new Date().toISOString().split('T')[0];
    this.key = 'token_price';
    this.OrderBy = 'True';
    // _lighboxConfig.fadeDuration = 1;
    _lighboxConfig.fitImageInViewPort = true;
    // _lighboxConfig.alwaysShowNavOnTouchDevices = true;
    // _lighboxConfig.wrapAround = true;
    // _lighboxConfig.disableKeyboardNav = true;
    _lighboxConfig.disableScrolling = true;
    _lighboxConfig.centerVertically = true;
  }

  ngOnInit() {
    this.getPaymentTypes();

    this.getScreenSize();
    this.carouselTile = {
      grid: { xs: 2, sm: 2, md: 2, lg: 4, all: 0 },
      slide: 2,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: true
      },
      load: 2,
      touch: false,
      easing: 'ease'
    }
    this.textCount = 256;
    this.news = [];
    this.keywords = [];
    this.getLoggedin();
    this.mainTokenName = this.service.mainTokenName
    this.route.params.subscribe(params => {
      this.currId = params[`id`]
      this.tokenDetailApi();
      this.newsFeed(this.newsFeed_ticket);
      this.commentData = {
        "project": "",
        "title": "",
        "comment": ""
      }
    })
  }



  getLoggedin() {
    if (localStorage.getItem('isloggedin') == "true") {
      this.isLoggedin = true;
    } else {
      this.isLoggedin = false;
    }

  }
  // **************** Token Detail Api ******************
  tokenDetailApi() {

    this._album = [];
    let tokenData = { "ticker": this.currId.split('-')[1], "comment_page": "1", "page": "1", 'ordering': this.OrderBy, 'ordering_on': this.key }

    this.isLoading = true;
    this.keywords = [];
    this.cryptoCurrencyID = localStorage.getItem("Cryptocurrency");
    this.bankTransferID = localStorage.getItem("bankTransfer");
    this.service.postApi(`view-token-detail`, tokenData, 0).subscribe(response => {

      console.log('tokenDetail', response);
      this.isLoading = false;
      if (response.status == 200) {
        this.tokenDet = response.body.token;
        this.marketPrice = response.body.market_price;
        this.titleService.setTitle(`Vertex Market - ${this.tokenDet.token_name} - ${this.tokenDet.ticker}`)
        this.seo.generateTags({
          title: this.titleService.setTitle(`Vertex Market - ${this.tokenDet.token_name} - ${this.tokenDet.ticker}`),
          description: "Vertex Market is a secondary market OTC Trading Platform for digital assets such as Utility Tokens, Security Tokens and Stable Coins as well as for major cryptocurrencies such as Bitcoin, Ethereum, Monero and others. Vertex provides comprehensive information about ICO and other blockchain related projects."
        })
        this.newsFeed_ticket = this.tokenDet.ticker
        // this.newsFeed(this.tokenDet.ticker);
        this.comments = response.body.all_comments;
        console.log('this.gallerydata', this.gallerydata);
        this.gallerydata = response.body.gallery_data;
        this.getGallery();
        if (response.body.Keywords !== null && response.body.Keywords.length > 0) {
          this.keywords = response.body.Keywords[0].keywords.split(',');
        }

        if (response.body.available_supply !== undefined && response.body.initial_supply !== undefined) {
          this.tokenDet.available_supply = response.body.available_supply;
          this.tokenDet.initial_supply = response.body.initial_supply;
        }
        this.offering = response.body.offering;
        this.totalRecords = response.body.pagination_data.total;
        this.totalComments = response.body.comment_pagination_data.comment_total;
        this.commentLimit = response.body.comment_pagination_data.comment_limit;
        this.calculateReminderTimeForOffering(this.offering);
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        if (this.tokenDet.video_url) {
          var match = this.tokenDet.video_url.match(regExp);
          this.newUrl = (match && match[2].length == 11) ? ('https://www.youtube.com/embed/' + match[2]) : 'error'
          if (this.newUrl == 'error') {
          } else {
            let iframe = this.hostElement.nativeElement.querySelector('iframe');
            iframe.src = this.newUrl
          }
        }
        this.tokenDet.averageRating = ((this.tokenDet.description_rating + this.tokenDet.logo_rating + this.tokenDet.start_date_rating + this.tokenDet.end_date_rating + this.tokenDet.ticket_rating + this.tokenDet.platform_rating + this.tokenDet.country_rating + this.tokenDet.milestone_rating + this.tokenDet.video_rating + this.tokenDet.whitepaper_rating) / 10).toFixed(2)
        let timer = response.body.timer_start;
        let timerEnd = response.body.timer_end;
        if (timer) {
          this.tokenDet.start_date = timer;
          this.tokenDet.end_date = timerEnd;
          this.calculateRemTime(this.tokenDet)
          setInterval(() => {
            this.calculateRemTime(this.tokenDet)
          }, 1000)
        } else {
          this.tokenDet.remTime = 'Ongoing' // No Offering Case
        }

      } else {
        this.service.toastrErr(`Something went wrong`)
      }

    }, error => {
      this.isLoading = false;
      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
        window.history.back()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }

    })
  }


  // **************** End Token Detail Api *******************
  // ************** Calculate Start Time *********************
  calculateRemTime(item) {
    let closeDate = new Date(item.start_date).getTime();
    let now = new Date().getTime();
    let distance = closeDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
      item.remTime = "Ongoing"
      item.remainingTime = 'Ongoing'
      item.remainingTimeMin = 'Ongoing'
    } else {
      item.remTime = {
        days: days.toString().split(''),
        hours: hours.toString().split(''),
        minutes: minutes.toString().split(''),
        seconds: seconds.toString().split('')
      }
      item.remainingTime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
      item.remainingTimeMin = `${this.formatNumber(days)} days, ${this.formatNumber(hours)} hh, ${this.formatNumber(minutes)} mm, ${this.formatNumber(seconds)} ss`
    }
  }
  // ************  End Calculate Start Time ***********************
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  formatNumber(n) {
    if (n < 10) {
      return "0" + n.toString();
    }
    return n.toString();
  }

  getAvailableToken(amount) {
    if (amount < 10) {
      return amount;
    }
    return amount.toFixed();
  }
  buyToken(item) {
    if (this.app.pendingTradeData.length) {
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
    debugger
    let data = { "id": this.newId }
    this.isLoading = true;
    this.service.postApi(`buy-token-detail`, data, 1).subscribe(response => {
      debugger
      this.tokenData1 = response.body.token;
      console.log('buy-token-detail', response);
      this.isLoading = false;
      if (response.status == 200) {
        this.service.buyTokenAlready = Object.assign({}, response.body)
        this.payment_type = localStorage.setItem('payement_type', Object.assign({}, response.body.token.payment_type));
        console.log(this.payment_type);
        this.router.navigate([`/buy-token`, this.newId, btoa('no'), this.tokenData1.payment_type])
      } else {
        this.service.buyTokenAlready = {};
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.service.buyTokenAlready = {};
      this.isLoading = false;
      if (error.status == 400 || error.status == 402) {
        // if (error.status == 400) {
        $(`#blockUser`).modal(`show`);
        this.blockError = error.error.message;
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }

  backTokensalepage() {
    this.router.navigate([`/token-sale/all`])
  }

  pageChanged(event: any): void {
    this.isLoading = true;
    let tokenData = { "ticker": this.currId.split('-')[1], "page": event.page, 'ordering': this.OrderBy, 'ordering_on': this.key }
    this.service.postApi(`view-token-detail`, tokenData, 0).subscribe(response => {
      this.isLoading = false;
      this.offering = response.body.offering;
      this.calculateReminderTimeForOffering(this.offering);
    }, error => {
      this.isLoading = false;
    })
  }
  show() {
    this.showMore = true;
    this.showPagin = true;
    this.tokenDetailApi();
  }
  shows() {
    this.showLess = true;
    this.showMore = false;
    this.showPagin = false;
    this.tokenDetailApi();
  }

  //sort based on the header selection
  sorting(key) {

    this.key = key;
    this.key = key;
    this.OrderBy = this.reverse ? 'True' : 'False';
    this.reverse = !this.reverse;
    this.tokenDetailApi();
  }

  convertToDate(date: any) {
    return new Date(date);
  }

  calculateReminderTimeForOffering(offers) {
    offers.forEach(offer => {
      this.calculateRemTime(offer);
      setInterval(() => {
        this.calculateRemTime(offer);
      }, 1000);
    });
  }

  newsFeed(ticker) {
    this.news = [];
    this.service.postApi(`get-news`, { ticker: this.currId.split('-')[1] }, 0).subscribe(response => {
      if (response.status === 200) {
        this.news = response.body.data.results;
      }
    }, error => {

    })
  }

  addComment() {
    this.captchaToken = this.captcha.getResponse();
    this.captcha.reset();
    if (this.captchaToken) {
      this.commentData = {
        "project": this.tokenDet.id,
        "title": this.commentData.title,
        "comment": this.commentData.comment
      }

      if (this.commentData.comment === '' || this.commentData.comment === null) {
        return;
      }
      if (this.commentData.title === '' || this.commentData.title === null) {
        return;
      }

      if (this.commentData.comment.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
        this.linkValidation = true;
        return;

      }

      this.service.postApi(`add-project-comment`, this.commentData, 1).subscribe(response => {
        this.tokenDetailApi();
        this.reset();
        if (response.status == 200) {
          this.service.toastrSucc(response.body.message)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        if (error.status == 400) {
          this.service.toastrErr(error.error.message)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      })
    } else {
      this.service.toastrErr(`Please verify captcha`)
    }
  }

  upVote(id) {
    this.isLoading = true;
    let votes = { "comment_id": id, "up": true }

    let isUserAuthorized = localStorage.getItem('loggedIn')
    let emailId = localStorage.getItem('loggedEmail')

    let upLikeKey = 'like-' + id;
    if (isUserAuthorized === 'true' && emailId !== undefined) {
      //add user Id also
      upLikeKey = 'like-' + emailId + '-' + id;
    }
    if (localStorage.getItem(upLikeKey) !== null && localStorage.getItem(upLikeKey) === 'true') {
      this.isLoading = false;
      return;
    }

    this.service.postApi(`add-votes`, votes, 0).subscribe(response => {
      this.tokenDetailApi();
      this.isLoading = false;
      localStorage.setItem(upLikeKey, 'true');
    }, error => {
      this.isLoading = false;
    })
  }

  downVote(id) {
    this.isLoading = true;
    let votes = { "comment_id": id, "up": false }

    let isUserAuthorized = localStorage.getItem('loggedIn')
    let emailId = localStorage.getItem('loggedEmail')
    let downLikeKey = 'like-' + id;
    if (isUserAuthorized === 'true' && emailId !== undefined) {
      //add user Id also
      downLikeKey = 'like-' + emailId + '-' + id;
    }

    if (localStorage.getItem(downLikeKey) !== null && localStorage.getItem(downLikeKey) === 'true') {
      this.isLoading = false;
      return;
    }

    this.service.postApi(`add-votes`, votes, 0).subscribe(response => {
      this.tokenDetailApi();
      this.isLoading = false;
      localStorage.setItem(downLikeKey, 'true');
    }, error => {
      this.isLoading = false;
    })
  }

  public reset() {
    this.commentData = {
      "project": "",
      "title": "",
      "comment": ""
    }
    this.tokenDetailApi();
  }
  textCounts(event) {
    this.textCountDisplay = this.textCount - event.target.value.trim().length;

  }
  bindTime(date: any) {
    return this.timeSince(new Date, new Date(date))
  }

  timeSince(dateNow: any, date: any) {

    var localTime: any = moment.utc(date).local().format();
    let localdatetime: any = new Date(localTime);
    var diff = dateNow - localdatetime;

    var seconds = Math.floor(diff / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes";
    }
    if (seconds < 0) {
      seconds = seconds * (-1);
    }
    return Math.floor(seconds) + " seconds";
  }

  commentPaginationChanged(event: any): void {
    this.isLoading = true;
    let tokenData = { "ticker": this.currId.split('-')[1], "comment_page": event.page, "page": '1', 'comment_limit': this.commentLimit, 'ordering': this.OrderBy, 'ordering_on': this.key }
    this.service.postApi(`view-token-detail`, tokenData, 0).subscribe(response => {
      this.isLoading = false;
      this.comments = response.body.all_comments;
      this.totalComments = response.body.comment_pagination_data.comment_total;
      this.commentLimit = response.body.comment_pagination_data.comment_limit;
    }, error => {
      this.isLoading = false;
    })
  }

  getGallery() {
    let images: Array<any> = new Array<any>();
    this.gallerydata.forEach(element => {
      const src = element.image;
      const thumb = element.image;
      const album = {
        src: src,
        thumb: thumb
      }
      images.push(album);
      this._album = images;
    });
  }


  openGallery(index: number): void {
    this._lightbox.open(this._album, index);
  }

  close(): void {
    this._lightbox.close();
  }
  getScreenSize() {
    this.iswebApp = true;
    let mobWidth = (window.screen.width)
    if (mobWidth < 1000) {
      this.iswebApp = false;
    }
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

  openModal(offer) {
    $(`#calculation`).modal(`show`);
    this.calculationOffer = offer;
    if (offer.payment_type == this.cryptoCurrencyID) {
      this.currencyOfName = offer.symbol_name;
    } else if (offer.payment_type == this.bankTransferID) {
      this.currencyOfName = offer.accepting_currency;
    }
    this.tokenValue = 0;
    this.tokenPrice = 0;
    this.calculatorprice = 0;

  }

  changeCalculatorValue(event) {
    this.tokenValue = event;
    this.tokenPrice = this.calculationOffer.token_price;
    this.calculatePrice(this.tokenValue, this.calculationOffer)
  }

  calculatePrice(buyValue, offer) {
    let data = {
      amount: offer.token_price * buyValue,
      is_login: this.isLoggedin
    }
    if (offer.payment_type == this.cryptoCurrencyID) {
      data['is_bank_transfer'] = false,
        data['symbol'] = offer.ticker
    }
    else if (offer.payment_type == this.bankTransferID) {
      data['is_bank_transfer'] = true,
        data['accepting_currency'] = offer.accepting_currency,
        data['quantity'] = buyValue
    }

    this.service.postApi(`calculate-total-price`, data, 0).subscribe(response => {
      this.calculatorprice = response.body;

    }, error => {
      this.service.toastrErr(`Something went wrong`)
    })
  }
  openModals(offer) {
    $(`#calculation`).modal(`show`);
    this.calculationOffer = offer;
    if (offer.payment_type == this.cryptoCurrencyID) {
      this.currencyOfName = offer.symbol_name;
    } else if (offer.payment_type == this.bankTransferID) {
      this.currencyOfName = offer.accepting_currency;
    }
    this.tokenValue = 0;
    this.tokenPrice = 0;
    this.calculatorprice = 0;
  }

  getPaymentTypes() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.service.getApi(`payment-types`, 0).subscribe(response => {
        this.isLoading = false;
        console.log(response)
        if (response.status == 200) {
          let paymentTypes = response.body.data;
          paymentTypes.forEach(p => {

            if (p.payment_type_name === 'Cryptocurrency') {
              localStorage.setItem("Cryptocurrency", p.id);
              this.cryptoCurrencyID = localStorage.getItem("Cryptocurrency");
            }

            else if (p.payment_type_name === 'Bank Transfer') {
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