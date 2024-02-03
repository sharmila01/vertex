import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
import { SeoService } from '../../providers/seo.service';
declare var $: any;
import { Cacheable } from 'ngx-cacheable';
import { HttpClient } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';

const CACHE_KEY = 'httpRepoCache'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  pinnedpro: any = [];
  ptradeHeaderShow: string;
  keyWord: string;
  currencies: any = [];
  news: any = [];
  selectedUsers1;
  selectedUsers2;
  buyTokensitem;
  spendTokensItem;
  symbolArr: any;
  public isTooltip: boolean = true;
  spendTokens: any;
  buyTokens: any;
  public isBuy: boolean = false;
  public dataFound: boolean = false;
  public isData: boolean = false;
  arrayRange;
  iswebApp: boolean = true;
  public isLoading: boolean = true;
  isLoggedIn: boolean = false;
  isLoggedOut: boolean = false;
  subscribeEmail: any = '';
  countryListArr: any = [];
  allCountryListArr: any = []
  public isDatas: boolean = false;
  public isTooltips: boolean = false;
  public isSearchSpend: boolean = false;
  contactusForm: FormGroup;
  whyChooseArr: any = [];
  howitsWorksData: any = {};
  customersSayData: any = [];
  whyData: any = {};
  aboutData: any = '';
  ongoingTokenArr: any = [];
  // upcomingTokenArr: any = [];
  pinnedprojects: any = [];
  nooffering: any = '';
  public sectorsSearch;
  public sectorsBuySearch;
  spendArr: any;
  buySearch;
  buyArr = [];
  spendData: any = [];
  lastTradesList: any;
  profile: any = [];
  banner = [
    { 'img': "../../../assets/images/hero-image-04-1.jpg" },
    // {'img' : "../../../assets/images/hero-image-04.jpg"},
    // {'img' : "../../../assets/images/hero-image-01.jpg"},
    // {'img' : "../../../assets/images/hero-image-02.jpg"},
    // {'img' : "../../../assets/images/hero-image-03.jpg"},
    // {'img' : "../../../assets/images/hero-image-05.jpg"},
    // {'img' : "../../../assets/images/hero-image-06.jpg"}    
  ]
  currency;
  constructor(private service: MainService, private fb: FormBuilder, private router: Router,
    private sanitizer: DomSanitizer, private seo: SeoService, public http: HttpClient) {
    window.scrollTo(0, 0)
    this.spendArr = this.spendData;
    this.buyArr = this.buyTokens;


  }

  ngOnInit() {
    this.getAllCurrency();
    console.log("local", JSON.stringify(localStorage.getItem('allcurrencies')))
    this.noOfferingproject();
    this.pinnedProjects();
    this.howWorksApi();
    this.getAllBuyerToken();
    this.whyChooseVertex();
    // this.getPlatformApi();
    this.countryListArr = this.service.countryList
    this.allCountryListArr = this.service.allCountryList
    this.aboutUsApi();
    // this.tokenSaleApi(`ongoing`);
    // this.profileApi();
    this.contactusForm = this.fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]*$/), Validators.minLength(2)])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,20})+$/i)])],
      // 'phoneCode': ['', Validators.required],
      // 'phoneNumber': ['', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]{4,15}$/)])],
      'country': [null, Validators.required],
      'message': ['', Validators.compose([Validators.required, Validators.pattern(/^\S.+\S$/)])]
    })
    //   $(document).click(function(e) {
    //     if (!$(e.target).is(".navbar-toggler, .navbar-toggler *, .navbar-collapse, .navbar-collapse *")) {
    //       console.log('click  hide')
    //       $(".navbar-toggler").addClass("collapsed");
    //       $(".navbar-collapse").removeClass("show");
    //       // $("body").removeClass("nav-open");
    //       // $(".sidebar").removeClass("sideOpen");
    //       // $(".main-panel").removeClass("mainPanelAnimate");
    //     }
    // });
    this.getNews();
    this.getLoggedin();
    this.getScreenSize();
    // if(window.history.length < 3)  
    this.showLastTrades();
    this.ptradeHeaderShow = localStorage.getItem('ptradeHeader')

  }

  getAllCurrency() {
    let data = {
      "is_inclde_fiat_currency": true
    }
    this.service.postApi('get-currency', data, 0).subscribe(response => {
      let crypto_data = response.body.crypto_data ;
       let fiat_data = response.body.fiat_data;
      this.spendData = Object.assign(crypto_data,fiat_data);
      this.spendArr = this.spendData;
      localStorage.setItem('allcurrencies', this.spendData)
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }


  showLastTrades() {
    this.service.getApi(`last-trades`, 0).subscribe(response => {
      if (response.status == 200) {
        this.lastTradesList = response.body.data;
        var x = document.getElementById("snackbar");
        x.className = "show";
      }
    }, error => {

    })
    // After 3 seconds, remove the show class from DIV
    // setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  closeSnackBar() {
    var x = document.getElementById("snackbar");
    x.className = "";
  }

  getLoggedin() {
    if (localStorage.getItem('isloggedin') == "true") {
      this.isLoggedIn = true;
    }
    else if (localStorage.getItem('isloggedin') == "false") {
      this.isLoggedOut = true;
    }

  }
  changeCode() {
    if (this.contactusForm.controls[`phoneCode`].value) {
      let index = this.countryListArr.findIndex(x => x.code == this.contactusForm.controls[`phoneCode`].value)
      if (index != -1)
        this.contactusForm.controls[`country`].setValue(this.countryListArr[index].country)
    }
  }
  changeCountry() {
    if (this.contactusForm.controls[`country`].value) {
      let index = this.countryListArr.findIndex(x => x.country == this.contactusForm.controls[`country`].value)
      if (index != -1)
        this.contactusForm.controls[`phoneCode`].setValue(this.countryListArr[index].code)
    }
  }

  //------------------------------ Contact Us API ------------------------------------------------
  contactUs() {
    let contactData = {
      "email": this.contactusForm.value.email,
      "name": this.contactusForm.value.name,
      "country": this.contactusForm.value.country,
      "message": this.contactusForm.value.message
    }
    this.isLoading = true;
    this.service.postApi(`contact-us`, contactData, 0).subscribe(response => {
      this.isLoading = false;
      if (response.status == 201) {
        this.service.toastrSucc(response.body.message)
        this.contactusForm.reset()
        this.contactusForm.patchValue({
          "phoneCode": "",
          "country": null
        })
        this.router.navigate(['/home'])
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })

  }
  // -------------------------------  End Contact Us API --------------------------------------

  // ----------------------------- Customer Review Api ----------------------------------------
  customerReviewApi() {
    this.isLoading = true;
    this.service.getApi(`customer-review`, 0).subscribe(response => {
      this.isLoading = false;
      if (response.status == 200) {
        this.customersSayData = response.body.data
        if (this.customersSayData.length > 3) {
          setTimeout(() => {
            this.slickFun()
          }, 300)
        }

      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }


  // --------------------- End Customer Review Api ----------------------------------

  // ------------------------- How works Api -----------------------------------------
  howWorksApi() {
    this.isLoading = true;
    this.service.getApi(`how-work`, 0).subscribe(response => {
      this.isLoading = false;
      if (response.status == 200) {
        if (response.body.data.length) {
          this.howitsWorksData = response.body.data[0]
          this.howitsWorksData.description = this.sanitizer.bypassSecurityTrustHtml(this.howitsWorksData.description)
        }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }
  // -----------------------  End How Works Api -----------------------------------

  // -------------------------  Why choose vertex API ------------------------------
  whyChooseVertex() {
    this.isLoading = true;
    this.service.getApi(`why-vertex`, 0).subscribe(response => {
      this.isLoading = false;
      if (response.status == 200) {
        this.whyChooseArr = response.body.data
        if (this.whyChooseArr.length) {
          let index = this.whyChooseArr.findIndex(x => x.id == 1)
          if (index != -1)
            this.whyData = this.whyChooseArr.splice(index, 1)[0]
          this.getSeo();
        }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }

  getSeo() {
    this.seo.generateTags({
      title: 'home Page',
      description: "Vertex Market is a secondary market OTC Trading Platform for digital assets such as Utility Tokens, Security Tokens and Stable Coins as well as for major cryptocurrencies such as Bitcoin, Ethereum, Monero and others. Vertex provides comprehensive information about ICO and other blockchain related projects."
    })
  }

  // ----------------------- End Why Choose Vertex API --------------------------------


  // ----------------------- About Us API ----------------------------------------------
  aboutUsApi() {
    this.isLoading = true;
    this.service.getApi(`about-us`, 0).subscribe(response => {
      this.isLoading = false;
      if (response.status == 200) {
        if (response.body.data.length)
          this.aboutData = this.sanitizer.bypassSecurityTrustHtml(response.body.data[0].description)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }

  // ---------------------- End About Us API ---------------------------------

  // -------------------- Token Sale Api -------------------------------------
  tokenSaleApi(type) {
    let tokenData = {
      "sale_type": type,
      "page": "1",
      "search": "False",
      "nameOrticker": "",
      "platform": "",
      "type": ""
    }
    this.isLoading = true;

    this.service.postApi(`project-list`, tokenData, 0).subscribe(response => {
      this.isLoading = false;
      if (response.status == 200) {
        if (type === `ongoing`) {
          this.ongoingTokenArr = response.body.token;
          this.getLimittedPinned(this.ongoingTokenArr, this.pinnedprojects);

        }
        //  else if (type === `upcoming`) {
        //   this.upcomingTokenArr = response.body.token
        //   let timer = response.body.timer;
        //   for (let item of this.upcomingTokenArr) {
        //     var startDate = timer[item.ticker];
        //     if (startDate !== undefined) {
        //       item.start_date = startDate;
        //     }
        //   }
        //   this.calculateRemTime(this.upcomingTokenArr)
        //   setInterval(() => {
        //     this.calculateRemTime(this.upcomingTokenArr)
        //   }, 1000)
        // }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if (error.status == 400) {
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }


  // ----------------------- End Token Sale Api ----------------------------

  // -------------------------- Calculate Start Time ------------------------
  calculateRemTime(arr) {
    for (let item of arr) {
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
        item.remTime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
      }
    }
  }


  // -------------------  End Calculate Start Time -------------------

  // ----------------------- Country List JSON ------------------------
  countryListApi() {
    this.service.getCountriesJson().subscribe(response => {
      this.countryListArr = response.countries
    }, error => {
      this.service.toastrErr(`Something went wrong`)
    })
  }

  // --------------------- End Country List JSON ----------------------

  goToTradingDetail(data) {
    // this.router.navigate([`/token-information`, data.ticker.toString()])
    this.router.navigate([`/token-information`, `${data.token_name.toString()}-${data.ticker.toString()}`])
    // localStorage.setItem('currentID', data.id);
    // localStorage.setItem('ticker', data.ticker);

  }

  // -------------------- Email Subscribe -----------------------------
  subscribeFun() {
    if (!this.subscribeEmail.match(/^[A-Z0-9_]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,3})+$/i))
      this.service.toastrErr(`Please enter valid email`)
    else {
      let subsData = {
        "email": this.subscribeEmail.trim()
      }
      this.isLoading = true;
      this.service.postApi(`newsletter`, subsData, 0).subscribe(response => {
        this.isLoading = false;
        if (response.status == 201) {
          this.subscribeEmail = ''
          this.service.toastrSucc(response.body.message)
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

  }
  // -------------------- End Email Subscribe ------------------------

  // ---------------------- Social Link ------------------------------
  openSocialLink(social) {
    if (social == `bitcoin`)
      window.open(`https://bitcointalk.org/index.php?topic=4630951.20`)
    else if (social == `fb`)
      window.open(`https://www.facebook.com/Vertex-253889245184397/`)
    else if (social == `twitter`)
      window.open(`https://twitter.com/Vertexplatform`)
    else if (social == `medium`)
      window.open(`https://medium.com/@official_83664?source=linkShare-5ab3c3779778-1529055568`)
    else if (social == `github`)
      window.open(`https://github.com/VertexCapxDev`)
    else if (social == `youtube`)
      window.open(`https://youtu.be/VUM_EBmoH-s`)
    else if (social == `telegram`)
      window.open(`https://t.me/Vertexmarkeplace`)
  }
  openImageLink(images) {
    if (images == `investing`)
      window.open(`https://www.investing.com/analysis/cryptocurrency-is-trending-but-wall-street-investors-are-still-skeptical-200339796`)
    else if (images == `yahoo`)
      window.open(`https://finance.yahoo.com/news/saudi-billionaires-invest-vertex-ico-161900183.html`)
    else if (images == `MWlogo`)
      window.open(`https://www.marketwatch.com/press-release/saudi-billionaires-invest-in-vertex-ico-startup-2018-07-31`)
    else if (images == `bizjournals`)
      window.open(`https://www.bizjournals.com/baltimore/prnewswire/press_releases/Maryland/2018/07/31/enUK201807318856?ana=prnews`)
    else if (images == `finanzen`)
      window.open(`https://www.finanzen.net/nachricht/aktien/saudi-billionaires-invest-in-vertex-ico-startup-6448619`)
    else if (images == `businessinsider`)
      window.open(`https://markets.businessinsider.com/news/stocks/saudi-billionaires-invest-in-vertex-ico-startup-1027417837`)
    else if (images == `morningstar`)
      window.open(`http://news.morningstar.com/all/canada-news-wire/20180731C7987/saudi-billionaires-invest-in-vertex-ico-startup.aspx`)
    if (images == `bitcoin`)
      window.open(`https://news.bitcoin.com/pr-vertex-launches-ico-aftermarket/`)
    else if (images == `bitcoinist`)
      window.open(`https://bitcoinist.com/vertex-launches-first-vetted-ico-token-aftermarket/`)
    else if (images == `newsbtc`)
      window.open(`https://www.newsbtc.com/press-releases/vertex-launches-first-vetted-ico-token-aftermarket/`)
    else if (images == `coinstaker`)
      window.open(``)
    else if (images == `coinspeaker`)
      window.open(``)
    else if (images == `ccn`)
      window.open(``)
    else if (images == `blockon`)
      window.open(``)
    if (images == `coinjournal`)
      window.open(`https://coinjournal.net/pr-release/vertex-is-the-next-step-in-ico-investments/`)
    else if (images == `cryptocurrencynews`)
      window.open(`https://cryptocurrencynews.com/press-release/vertex-battle-of-the-meetups/`)
    else if (images == `finanznachrichten`)
      window.open(`https://www.finanznachrichten.de/nachrichten-2018-08/44425238-saudische-milliardaere-investieren-in-ico-startup-vertex-007.htm`)
    else if (images == `indiatoday`)
      window.open(`https://www.indiatoday.in/pr-newswire?rkey=20180731enUK201807318856_indiapublic&filter=4315`)
    else if (images == `nbc12`)
      window.open(`http://www.nbc12.com/story/38777384/saudi-billionaires-invest-in-vertex-ico-startup`)
    else if (images == `exame`)
      window.open(`https://exame.abril.com.br/negocios/releases/os-bilionarios-sauditas-investem-na-startup-de-ico-vertex/`)

  }

  // ---------------------------- End Social Link -----------------------
  // -----------------------  For Marquee -------------------------------
  slickFun() {
    $('.fourBox').slick({
      centerMode: true,
      centerPadding: '0px',
      slidesToShow: 3,
      infinite: true,
      responsive: [{
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 576,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 1
        }
      }
      ]
    });
  }
  // -------------------  End Marquee --------------------------
  noOfferingproject() {
    this.isLoading = true;
    this.service.getApi(`no-offering-projects`, 0).subscribe(response => {
      this.isLoading = false;
      if (response.status == 200) {
        this.nooffering = response.body.token

      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }

  getLimittedPinned(ongoingTokenArr: any[], pinnedprojects: any[]) {
    if (ongoingTokenArr.length > 0 && pinnedprojects.length < 12) {
      let sliceNumber = pinnedprojects.length
      pinnedprojects = this.pinnedprojects.slice(0, sliceNumber);
      var limittedPinned = pinnedprojects.concat(ongoingTokenArr);
      this.pinnedprojects = limittedPinned.slice(0, 12);

    }
    if (ongoingTokenArr.length > 0 && pinnedprojects.length === 0) {
      this.pinnedprojects = ongoingTokenArr.slice(0, 12);
    }
  }

  pinnedProjects() {
    this.isLoading = true;
    this.service.getApi(`pinned-project`, 0).subscribe(response => {
      this.isLoading = false;
      this.tokenSaleApi(`ongoing`);
      if (response.status == 200) {
        this.pinnedprojects = response.body.token;
        if (this.pinnedprojects.length >= 12) {
          this.pinnedprojects = this.pinnedprojects.slice(0, 12);
        }

      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }


  getScreenSize() {
    this.iswebApp = true;
    let mobWidth = (window.screen.width)
    if (mobWidth < 1000) {
      this.isTooltip = false;
      this.isTooltips = false;
      this.iswebApp = false;
    }
  }

  searchSpender() {
    this.isTooltip = true;
    this.isTooltips = false;
  }

  searchSpends() {
    this.isTooltip = false;
    this.sectorsSearch = "";
  }

  searchBuy() {
    this.isTooltip = false;
    this.isTooltips = true;
  }

  searchBuys() {
    this.isTooltips = false;
    this.buyTokens = "";
  }


  getNews() {
    this.isLoading = true;
    this.service.getApi(`news`, 0)
      .subscribe(response => {
        this.isLoading = false;
        if (response.status === 200) {
          this.news = response.body.data;
        }
      }, error => {
        this.isLoading = false;
      });
  }




  getSelectedSpend(symbol_name,is_fiat_currency) {
    localStorage.setItem('searchSelectedSpend', symbol_name);
    localStorage.setItem('selectedFiatCurrency', is_fiat_currency);
    console.log(localStorage.setItem('selectedFiatCurrency', is_fiat_currency))

    this.router.navigate([`/token-sale/ongoing`])
  }


  getSelectedBuy(item) {
    this.router.navigate([`/token-information`, `${item.token_name.toString()}-${item.ticker.toString()}`])

  }


  getAllBuyerToken() {
    let buyData = {
      "search": "",
      "page": ""
    }
    this.isTooltips = false;
    this.service.postApi(`want-to-buy`, buyData, 0).subscribe(response => {
      console.log('want-to-buy', response);
      this.isTooltips = false;
      this.buyTokens = response.body.data;
      if (response.status == 200) {
        this.buyTokens = response.body.data;
        this.buyArr = this.buyTokens;
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.service.toastrErr(`Something went wrong`)
    })
  }


  // search functionality using ngx-datatable for product table 
  filterBuy(event) {

    this.isTooltips = false;
    if (event.target.selectionStart > 0) {
      this.isTooltips = false;
      const val = event.target.value.toLowerCase();
      const buyArr = this.buyArr.filter(function (d) {

        return d.token_name.toLowerCase().indexOf(val) !== -1 || d.ticker.toLowerCase().indexOf(val) !== -1 || !val;
      });
      this.buyTokens = buyArr;
      this.sectorsBuySearch = this.buyTokens;
      this.keyWord = val;
      if (this.sectorsBuySearch.length == 1) {

        localStorage.setItem('searcNameOrTicker', val)
        this.buyTokensitem = this.sectorsBuySearch[0];
        if (event.code == "Enter" || event.code == "NumpadEnter") {
          this.getSelectedBuy(this.sectorsBuySearch[0]);

        }
      }

      if (buyArr.length === 0) {
        this.isTooltips = false;
      }
    }
    else if (event.target.selectionStart == 0) {
      this.isTooltips = true;
      if (this.sectorsBuySearch && event.code == "Enter" || event.code == "NumpadEnter") {

        if (this.sectorsBuySearch.length == 1) {
          this.getSelectedBuy(this.buyTokensitem);
        }
        else {
          localStorage.setItem('searcNameOrTicker', this.keyWord)
          this.router.navigate([`/token-sale/all`])
        }
      }

      this.sectorsBuySearch = '';
      this.buyTokens = '';
    }
  }

  // search functionality using ngx-datatable for product table 
  filterSpend(event) {

    setTimeout(() => {
      this.currencies = localStorage.getItem('allcurrencies');
    }, 86400000)

    this.isTooltip = false;
    if (event.target.selectionStart > 0) {
      this.isTooltip = false;
      const val = event.target.value.toLowerCase();
      const spendArr = this.spendArr.filter(function (d) {
        return d.platform_currency_symbol.toLowerCase().indexOf(val) !== -1 || d.platform_currency_ticker.toLowerCase().indexOf(val) !== -1 || !val;
      });
      this.spendData = spendArr;
      this.sectorsSearch = this.spendData;
      this.keyWord = val;
      if (this.sectorsSearch.length == 1) {

        localStorage.setItem('searcNameOrTicker', val)
        this.spendTokensItem = this.sectorsSearch[0];
        if (event.code == "Enter") {
          this.getSelectedBuy(this.sectorsSearch[0]);
        }
      }

      if (spendArr.length === 0) {
        this.isTooltip = false;
      }
    }
    else if (event.target.selectionStart == 0) {

      this.isTooltip = true;
      if (this.sectorsSearch && event.code == "Enter") {

        localStorage.setItem('searcNameOrTicker', this.keyWord)
        localStorage.setItem('searchSelectedSpend', this.spendTokensItem.platform_currency_symbol);
        localStorage.setItem('selectedFiatCurrency', this.spendTokensItem.is_fiat_currency);

        this.router.navigate([`/token-sale/ongoing`])
        // this.getSelectedSpend(this.spendTokensItem.platform_currency_symbol); 
      }

      this.sectorsSearch = '';
      this.spendData = '';
    }
  }


  // profileApi() {
  //   this.isLoading = true;

  //   this.service.getApi(`profile`, 1).subscribe(response => {
  //     console.log('profileData----------------------', response);
  //     this.profile = response.body.data;
  //     this.isLoading = false;


  //   }, error => {
  //     this.isLoading = false
  //     if (error.status == 400) {
  //       this.service.toastrErr(error.error.message)
  //     } else {
  //       this.service.toastrErr(`Something went wrong`)
  //     }


  //   })
  // }

  ngOnDestroy() {
    localStorage.setItem('ptradeHeader', 'false');
    this.ptradeHeaderShow = '';
  }
}
