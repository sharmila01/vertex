import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd, NavigationStart, RoutesRecognized } from '@angular/router';
import { MainService } from './providers/mainService.service';
import { TranslateService } from '@ngx-translate/core';
import { UserIdleService } from '../../node_modules/angular-user-idle';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { ngxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';
import { Meta, Title } from '@angular/platform-browser';
import { resolve } from 'url';
// import '../../../vertex-portal/src/assets/js/prerender.js';

// declare const prerender: any;

declare global {
  interface Window { prerenderReady: boolean; }
}
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  currentLanguage: string;
  navigationSubscription;
  iswebApp: boolean = true;
  public isLoading: boolean = false;
  title = 'app';
  seotitle;
  tickerusd: any = '';
  // show = true;
  // hide = false;
  cryptoCurrencyID;
  bankTransferID;
  public language;
  isLoggedIn: any = false;
  currUrl: any = '';
  notifications: any[];
  unSeenCount: number;
  hoverActiveButton: any = '';
  clicked: any = ``;
  whitepaper: any = '';
  profile: any;
  pendingTradeData: any = [];
  constructor(private _ngxZendeskWebwidgetService: ngxZendeskWebwidgetService, private router: Router, private service: MainService, private translate: TranslateService, private userIdle: UserIdleService, private metaService: Meta, private titleService: Title) {
    
    translate.addLangs(["en", "zh-Hans", "ar-sa"]);
    translate.setDefaultLang('en');
    this.currentLanguage = 'en';
    this.router;
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en-US|zh-Hans|ar-sa/) ? browserLang : 'en');
    /**    Subscribe to Signin Observable    */
    this.service.signInObs.subscribe(response => {
      if (response == `loggedin`) {
        this.isLoggedIn = true;
        localStorage.setItem('isloggedin', 'true');
        this.getNotifications();
        this.profileApi();

      }
      else if (response == `loggedout`) {
        this.isLoggedIn = false
        localStorage.setItem('isloggedin', 'false');
        if (!(this.currUrl == `home` || this.currUrl == `about-us` || this.currUrl == `terms` || this.currUrl == `privacy-policy` || this.currUrl == `faq` || this.currUrl == `how-works` || this.currUrl == `white-paper` || this.currUrl == `forgot-password` || this.currUrl == `reset-password` || this.currUrl == `token-sale` || this.currUrl == `token-information` || this.currUrl == `` || this.currUrl == `vertex` || this.currUrl == `activate-email` || this.currUrl == `contact-us` || this.currUrl == `digital-assets` || this.currUrl == `news`))
          this.router.navigate([`/vertex`, `login`])
      }
      this.checkSticker();
    }, error => {
      // console.log(error)

    })
    /**  End Subscribe to Signin Observable   */
    /** Idle Functionality */
    this.userIdle.startWatching()
    this.userIdle.onTimerStart().subscribe(count => {
    })

    this.userIdle.onTimeout().subscribe(() => {
      // Time's up
      this.userIdle.resetTimer()
      window.location.reload()
    })
    /** End Idle Functionality */

    // ********* Manage Routing of Buy Token Page(On reload navigate to home)  *************
    router.events.subscribe((event: Event) => {

      if (event instanceof RoutesRecognized) {
        if (event.id == 1 && event.url.split('/')[1] == "buy-token") {
          this.router.navigate(['/home'])
          return;
        }

      }
      if (event instanceof NavigationEnd) {
        this.service.interval ? clearInterval(this.service.interval) : ''
        this.service.kycInterval ? clearInterval(this.service.kycInterval) : ''
        if (this.router.routerState.snapshot.root.children.length) {
          let data = this.router.routerState.snapshot.root.children[0].data
          if (!data.title)
            data = this.router.routerState.snapshot.root.children[0].children[0].data
          this.seotitle = this.titleService.setTitle(`Vertex Market - ${data.title}`)
          console.log(this.titleService.setTitle(`Vertex Market - ${data.title}`));
        }
        if (localStorage.getItem('kyc_result') != null) {
          localStorage.removeItem('kyc_result')
        }
        this.currUrl = event.url.split('/')[1]
        this.loadDefaultScript()

        if (this.currUrl == `vertex`) {
          setTimeout(() => {
            this.hoverActiveButton = this.service.loginVar
          }, 100)
        } else {
          this.service.loginVar = ``
          this.hoverActiveButton = ``
        }
        if (localStorage.getItem(`loginToken`) != null) {
          this.service.changeSigninBs(`loggedin`)
          if (this.currUrl == `forgot-password` || this.currUrl == `vertex` || this.currUrl == `reset-password`)
            this.router.navigate([`/home`])
          this.pendingTradesApi();
        } else {

          if (!(this.currUrl == `home` || this.currUrl == `news` || this.currUrl == `about-us` || this.currUrl == `terms` || this.currUrl == `privacy-policy` || this.currUrl == `faq` || this.currUrl == `how-works` || this.currUrl == `white-paper` || this.currUrl == `forgot-password` || this.currUrl == `reset-password` || this.currUrl == `token-sale` || this.currUrl == `token-information` || this.currUrl == `` || this.currUrl == `vertex` || this.currUrl == `activate-email` || this.currUrl == `contact-us` || this.currUrl == `digital-assets`)) {
            this.router.navigate([`/vertex`, `login`])
          }
          this.service.changeSigninBs(`loggedout`)
        }
      }
      // this.pendingTradesApi();
    })

    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        // $(`
        // <script type="text/javascript">
        //     window.prerenderReady = false;
        // </script>
        // `).appendTo(document.body);
      }
    });
  }
  ngOnInit() {
    this.getPaymentTypes();
    this._ngxZendeskWebwidgetService.show();
    $(document).click(function (e) {
      if (!$(e.target).is(".navbar-toggler, .navbar-toggler *")) {
        $(".navbar-collapse").removeClass('show');
      }
    });
    this.unSeenCount = 0;
    this.notifications = [];
    this.getTickerusd();
    this.updateTradePrice();
    this.getScreenSize();


  }


  loadDefaultScript() {
    var scripts = document.getElementsByTagName("script");
    let isFound = false;
    $(document).ready(function () {
      $('#preRenderScriptTrue').remove();
      $(`
      <script type="text/javascript" id="preRenderScriptFalse">
          window.prerenderReady = false;
      </script>
      `).appendTo(document.body);
      setTimeout(prerender, 10000);
      function prerender() {
        $('#preRenderScriptFalse').remove();
        $(`
        <script type="text/javascript" id="preRenderScriptTrue">
            window.prerenderReady = true;
        </script>
        `).appendTo(document.body);
      }

    });

    $('script').each(function () {
      if (this.src.includes('quantserve.com'))
        $(this).remove()
      if (this.outerHTML.includes('_qevents.push'))
        $(this.remove())
    });

    if (this.currUrl == `kyc`) {
      $(`
        <script type="text/javascript">
          var _qevents = _qevents || [];
          (function() {
            var elem = document.createElement('script');
            elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
            elem.async = true;
            elem.type = "text/javascript";
            var scpt = document.getElementsByTagName('script')[0];
            scpt.parentNode.insertBefore(elem, scpt);
          })();
          _qevents.push({qacct:"p-GSZV1HE7Z21fD",labels:"_fp.event.KYC",event:"refresh"});
        </script>
        `).appendTo(document.body);

    } else {
      $(`
        <script type="text/javascript">
          var _qevents = _qevents || [];
          (function() {
            var elem = document.createElement('script');
            elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
            elem.async = true;
            elem.type = "text/javascript";
            var scpt = document.getElementsByTagName('script')[0];
            scpt.parentNode.insertBefore(elem, scpt);
          })();
          _qevents.push({qacct:"p-GSZV1HE7Z21fD"});
        </script>
        `).appendTo(document.body);
    }
    // }




  }

  loadKycScript() {
    var _qevents = _qevents || [];

    (function () {
      var elem = document.createElement('script');
      elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
      elem.async = true;
      elem.type = "text/javascript";
      var scpt = document.getElementsByTagName('script')[0];
      scpt.parentNode.insertBefore(elem, scpt);
    })();
    _qevents.push({ qacct: "p-GSZV1HE7Z21fD", labels: "_fp.event.KYC", event: "refresh" });
  }


  changeLang(lang) {
    this.language = this.translate.use(lang);
    this.currentLanguage = lang;
    
    // if (lang == 'en') {
    //   this.show = true;
    //   this.hide = false

    // } else if (lang == 'zh-Hans') {
    //   this.show = false;
    //   this.hide = true
    // }
    for (let i = 0; i < this.notifications.length; i++)
      this.notificationTranslate(this.notifications[i], i);
  }


  getCurrentLang() {
    console.log(this.translate.currentLang);
  }
  // ************* Get Profile (User Detail) Api **************
  getProfileApi(val) {

    // val = 1 for institutional pages check, val = 2 for  profile navigation

    // console.log('for instituional check')
    // this.service.spinnerShow()
    this.isLoading = true;

    this.service.getApi(`profile`, 1).subscribe(response => {
      this.isLoading = false;

      // console.log(JSON.stringify(response))
      // this.service.spinnerHide()
      if (response.status == 200) {
        let profileData = response.body.data
        if (val == 1) {
          if (!profileData.is_institutional) {
            this.service.toastrErr(`You are not allowed to access this page`)
            this.router.navigate(['/home'])
          }



        } else if (val == 2) {
          if (!profileData.is_institutional)
            this.router.navigate(['/profile'])

          else
            this.router.navigate(['/institutional/profile'])

        } else if (val == 3) {
          if (!profileData.is_institutional)
            this.router.navigate(['/transaction-history'])

          else
            this.router.navigate(['/institutional/transaction-history'])
        }


      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false
      // this.service.spinnerHide()

      if (error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }


    })
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
  // ******** End Get Profile (User Detail) Api ***************
  loginFun() {
    this.router.navigate([`/vertex`, `login`])
  }
  registerFun() {
    this.router.navigate([`/vertex`, `signup`])
  }
  logoutModal() {
    $(`#logoutModal`).modal(`show`)
  }
  // *************** Logout API ****************************
  logoutFun() {
    this.service.getApi(`logout`, 1).subscribe(response => {
      $(`#logoutModal`).modal(`hide`)
      if (response.status == 200) {
        this.service.changeSigninBs(`loggedout`)
        this.service.toastrSucc(response.body.message)
        if (localStorage.getItem(`loginToken`) != null) {
          localStorage.removeItem(`loginToken`)
        }
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      $(`#logoutModal`).modal(`hide`)
      this.service.toastrErr(`Something went wrong`)
    })



  }
  // *************** End Logout API ****************************

  // *************** Social Link ***************************
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
  // ************* End Social Link *************************

  //  // *************Notification Section*************************
  getNotifications() {
    if (!this.isLoggedIn) {
      return;
    }
    this.notifications = [];
    this.unSeenCount = 0;
    // console.log(" Notification 1");
    // setInterval(() => {
    this.service.getApi(`get-notification`, 1)
      .subscribe(response => {
        if (response.status === 200) {
          this.notifications = response.body.data;
          const unSeenNotis = this.notifications.filter(x => !x.is_seen);
          this.unSeenCount = unSeenNotis.length;
          for (let i = 0; i < this.notifications.length; i++)
            this.notificationTranslate(this.notifications[i], i);
        }
      }, error => {
        // console.log('error')
      });
    // }, 5000);   
  }

  seenNotification(id) {
    if (!this.isLoggedIn) {
      return;
    }
    const tokenData = { 'notification_id': Number(id) }
    this.service.postApi(`seen-notification`, tokenData, 1).subscribe(response => {
      // console.log("seenNotification1");
      this.getNotifications();
    }, error => {
      // console.log('error')
    })
  }

  deleteNotification(id) {
    if (!this.isLoggedIn) {
      return;
    }
    // const tokenData = { 'notification_id': Number(id) }
    // this.service.postApi(`delete-notification`, tokenData, 1).subscribe(response => {
    //   this.getNotifications();
    // }, error => {
    //   console.log('error')
    // })
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
      seconds = (-1) * seconds;
    }
    return Math.floor(seconds) + " seconds";
  }
  // *************End of notification section*************************
  getTickerusd() {
    this.service.getApi(`ticker-usd`, 0).subscribe(response => {
      if (response.status == 200) {
        this.tickerusd = response.body;
      }
      else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.service.toastrErr(`Something went wrong`)
    })
  }


  updateTradePrice() {
    setInterval(() => {
      this.getTickerusd();
    }, 100000)
  }



  getScreenSize() {
    this.iswebApp = true;
    let mobWidth = (window.screen.width)
    if (mobWidth < 1000) {
      this.iswebApp = false;
    }
  }

  goToTokensale() {
    this.router.navigate([`/token-sale/ongoing`]);
    localStorage.setItem('selectedBuytoken', 'true');
  }

  onPageLoad() {

    window.location.href = this.currUrl;
  }


  initialiseInvites() {
    // Set default values and re-fetch any data you need.
  }

  // getCurrentURL(){
  //   if(!(this.currUrl == `home` && this.currUrl == `about-us` && this.currUrl == `terms` && this.currUrl == `privacy-policy` || this.currUrl == `faq` || this.currUrl == `how-works` || this.currUrl == `white-paper` || this.currUrl == `forgot-password` || this.currUrl == `reset-password` || this.currUrl == `token-sale` || this.currUrl == `token-information` || this.currUrl == `` || this.currUrl == `vertex` || this.currUrl == `activate-email`|| this.currUrl == `contact-us` || this.currUrl == `digital-assets` ) ){

  //   }

  // }
  pendingTradesApi() {
    this.isLoading = true;
    this.service.getApi(`pending-trades`, 1).subscribe(response => {
      this.isLoading = false;
      if (response.status == 200) {
        this.pendingTradeData = response.body.data
      } else {
        // this.service.toastrErr(`Something went wrong`);
      }
      this.checkSticker();
      this.getPtradeHeader();
    }, error => {
      this.isLoading = false;
      // this.service.toastrErr(`Something went wrong`);
      this.checkSticker();
      this.getPtradeHeader();
    })
  }

  checkSticker() {
    setTimeout(() => {
      if ($(".ptrade-header").hasClass("checkSticker")) {
        $("body").addClass("stickerAddedd");
      }
      else {
        $("body").removeClass("stickerAddedd");
      }
    }, 0)
    
  }

  getPtradeHeader() {
    if (this.isLoggedIn && this.currUrl != `institutional` && this.currUrl != `buy-token` && this.pendingTradeData.length) {
      localStorage.setItem('ptradeHeader', 'true');
    }
    else {
      localStorage.setItem('ptradeHeader', 'false');
    }
  }
  // getDashboardLink(){
  //   if (this.profile.seller_tier === 'S1' && this.profile.seller_tier === 'S2') {
  //     return '/institutional/dashboard';
  //   }
  //   return this.currUrl;
  // }
  
  navigateBuy() {
    let item = this.pendingTradeData[0];
    this.router.navigate(['/buy-token', item.order_id, btoa(item.transaction_status),item.payment_type])
  }
  getNoti() {
    // this.getS().then(res => res);
  }
  getS() {
    return new Promise((resolve, reject) => {
      resolve('da')
    })
  }

  notificationTranslate(notification, i) {
    // console.log(notification)
    if (notification.title == 'ETH Received') {
      this.translate.get('We have received').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let d = `${response} ${notification.quantity} ETH`
        d = d.length > 25 ? d.substr(0, 25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if (notification.title == 'New Trade ETH') {
      this.translate.get('New Trade for').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        this.translate.get('for').subscribe(res => {
          let d = `${response} ${notification.entity} ${res} ${notification.quantity} ETH`
          d = d.length > 25 ? d.substr(0, 25) + '...' : d;
          this.notifications[i].messages = d;
        })
      })
    } else if (notification.title == 'BTC Received') {
      this.translate.get('We have received').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let d = `${response} ${notification.quantity} BTC`
        d = d.length > 25 ? d.substr(0, 25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if (notification.title == 'New Trade BTC') {
      this.translate.get('New Trade for').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        this.translate.get('for').subscribe(res => {
          let d = `${response} ${notification.entity} ${res} ${notification.quantity} BTC`
          d = d.length > 25 ? d.substr(0, 25) + '...' : d;
          this.notifications[i].messages = d;
        })
      })
    } else if (notification.title == 'ERC20 Received') {
      this.translate.get('We have received').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let d = `${response} ${notification.quantity} ERC20`
        d = d.length > 25 ? d.substr(0, 25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if (notification.title == 'New Trade ERC20') {
      this.translate.get('New Trade for').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        this.translate.get('for').subscribe(res => {
          let d = `${response} ${notification.entity} ${res} ${notification.quantity} ERC20`
          d = d.length > 25 ? d.substr(0, 25) + '...' : d;
          this.notifications[i].messages = d;
        })
      })
    } else if (notification.title == 'ETH Sent') {
      return this.translate.get('We have sent you').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let d = `${response} ${notification.quantity} ETH`
        d = d.length > 25 ? d.substr(0, 25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if (notification.title == 'Token Sent') {
      return this.translate.get('We have sent you').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let d = `${response} ${notification.quantity} Tokens`
        d = d.length > 25 ? d.substr(0, 25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if (notification.title == 'BTC Sent') {
      this.translate.get('We have sent you').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let d = `${response} ${notification.quantity} BTC`
        console.log(d);
        d = d.length > 25 ? d.substr(0, 25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else {
      return this.translate.get(notification.title).subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let d = response.length > 25 ? response.substr(0, 25) + '...' : response;
        this.notifications[i].messages = d;
      })
    }
  }
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
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
            }
            else if (p.payment_type_name === 'Bank Transfer'){
              localStorage.setItem("bankTransfer", p.id);
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
