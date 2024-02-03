import { Component, OnInit, Input } from '@angular/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { MainService } from '../../../providers/mainService.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'app-in-header',
  templateUrl: './in-header.component.html',
  styleUrls: ['./in-header.component.css']
})
export class InHeaderComponent implements OnInit {
  public currentLanguage: string;
  iswebApp: boolean= true;
  isLoading;
  notifications: any[];
  unSeenCount: number;
  tickerusd: any = '';
  show = true;
  public language;
  hide = false;

  @Input() headerName: string;
  //getNotify: any=false;
  constructor(private router: Router, private service: MainService, private translate: TranslateService) { 
    translate.addLangs(["en", "zh-Hans", "ar-sa"]);
    translate.setDefaultLang('en');
    this.currentLanguage = 'en';
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en-US|zh-Hans|ar-sa/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.getScreenSize();
    $(document).click(function (e) {
      if (!$(e.target).is(".navbar-toggler, .navbar-toggler *")) {
        $(".navbar-collapse").removeClass('show');
      }
    });
  //  this.getProfileApi();
    this.getNotifications();
    this.getTickerusd();
    this.updateTradePrice();
  
  }
  getCurrentLang() {
    console.log(this.translate.currentLang);
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
    for(let i = 0; i< this.notifications.length; i++)
      this.notificationTranslate(this.notifications[i], i);
  }

  //********************************** Profile Api *************/
  // getProfileApi() {
  
  //   // val = 1 for institutional pages check, val = 2 for  profile navigation

  //   // console.log('for instituional check')
  //   // this.service.spinnerShow()
  //   // this.isLoading = true;

  //   this.service.getApi(`profile`, 1).subscribe(response => {
  //     this.isLoading = false;
  		
  //     // console.log(JSON.stringify(response))
  //     // this.service.spinnerHide()
  //     if (response.status == 200) {
  //       let profileData = response.body.data
  //      //this.getNotify = profileData.is_institutional;
  //      //console.log("GetNotify 2--->> ",this.getNotify);
       
  //       // if (val == 1) {
  //       //   if (!profileData.is_institutional) {
  //       //     this.service.toastrErr(`You are not allowed to access this page`)
  //       //     this.router.navigate(['/home'])
  //       //   }

  //       // } else if (val == 2) {
  //       //   if (!profileData.is_institutional)
  //       //     this.router.navigate(['/profile'])

  //       //   else
  //       //     this.router.navigate(['/institutional/profile'])
     
  //       // } else if (val == 3) {
  //       //   if (!profileData.is_institutional)
  //       //     this.router.navigate(['/transaction-history'])

  //       //   else
  //       //     this.router.navigate(['/institutional/transaction-history'])
  //       // }
    

  //     } else {
  //       this.service.toastrErr(`Something went wrong`)
  //     }
  //   }, error => {
  //     this.isLoading = false
  //     // this.service.spinnerHide()

  //     if (error.status == 400) {
  //       this.service.toastrErr(error.error.message)
  //     } else {
  //       this.service.toastrErr(`Something went wrong`)
  //     }
  

  //   })
  // }
   // *************Notification Section*************************
   getNotifications() {
    
    this.notifications = [];
    this.unSeenCount = 0;
   
    
      // setInterval(() => {
        this.service.getApi(`get-notification`, 1)
        .subscribe(response => {
          if (response.status === 200) {
            this.notifications = response.body.data;
            const unSeenNotis = this.notifications.filter(x => !x.is_seen);
            this.unSeenCount = unSeenNotis.length;
            for(let i = 0; i< this.notifications.length; i++)
              this.notificationTranslate(this.notifications[i], i);
          }
        }, error => {
          console.log('error')
        });
      // }, 5000);
   
    
  }

  seenNotification(id) {
    
    const tokenData = { 'notification_id': Number(id) }
    this.service.postApi(`seen-notification`, tokenData, 1).subscribe(response => {
      console.log("seenNotification2");
     this.getNotifications();
    }, error => {
      console.log('error')
    })
  }

  deleteNotification(id) {    

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
    if(seconds<0) {
      seconds = (-1)*seconds;
    }
    return Math.floor(seconds) + " seconds";
  }
  // *************End of notification section*************************
  getTickerusd() {
		this.service.getApi(`ticker-usd`, 0).subscribe(response => {
			if(response.status == 200) {
				this.tickerusd = response.body;
			} else {
				this.service.toastrErr(`Something went wrong`)
			}
		}, error => {
			this.service.toastrErr(`Something went wrong`)
		})
  }

  updateTradePrice(){
    setInterval(() => {
      this.getTickerusd();
    },100000)
  }
  
  getScreenSize()  {
    this.iswebApp = true;
    let mobWidth = (window.screen.width)  
    if(mobWidth < 1000){
      this.iswebApp = false;
    }
  }
  
  notificationTranslate(notification, i) {
    // console.log(notification)
    if(notification.title == 'ETH Received') {
      this.translate.get('We have received').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let  d = `${response} ${notification.quantity} ETH`
        d= d.length>25 ? d.substr(0,25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if(notification.title == 'New Trade ETH') {
      this.translate.get('New Trade for').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        this.translate.get('for').subscribe(res => {
          let  d = `${response} ${notification.entity} ${res} ${notification.quantity} ETH`
          d= d.length>25 ? d.substr(0,25) + '...' : d;
          this.notifications[i].messages = d;
        })    
      })
    } else if(notification.title == 'BTC Received') {
      this.translate.get('We have received').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let  d = `${response} ${notification.quantity} BTC`
        d= d.length>25 ? d.substr(0,25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if(notification.title == 'New Trade BTC') {
      this.translate.get('New Trade for').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        this.translate.get('for').subscribe(res => {
          let  d = `${response} ${notification.entity} ${res} ${notification.quantity} BTC`
          d= d.length>25 ? d.substr(0,25) + '...' : d;
          this.notifications[i].messages = d;
        })    
      })
    } else if(notification.title == 'ERC20 Received') {
      this.translate.get('We have received').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let  d = `${response} ${notification.quantity} ERC20`
        d= d.length>25 ? d.substr(0,25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if(notification.title == 'New Trade ERC20') {
      this.translate.get('New Trade for').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        this.translate.get('for').subscribe(res => {
          let  d = `${response} ${notification.entity} ${res} ${notification.quantity} ERC20`
          d= d.length>25 ? d.substr(0,25) + '...' : d;
          this.notifications[i].messages = d;
        })    
      })
    } else if(notification.title == 'ETH Sent') {
      return this.translate.get('We have sent you').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let  d = `${response} ${notification.quantity} ETH`
        d= d.length>25 ? d.substr(0,25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if(notification.title == 'Token Sent') {
      return this.translate.get('We have sent you').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let  d = `${response} ${notification.quantity} Tokens`
        d= d.length>25 ? d.substr(0,25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else if(notification.title == 'BTC Sent') {
      this.translate.get('We have sent you').subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let  d = `${response} ${notification.quantity} BTC`
        console.log(d);
        d= d.length>25 ? d.substr(0,25) + '...' : d;
        this.notifications[i].messages = d;
      })
    } else {
      return this.translate.get(notification.title).subscribe(response => {
        // console.log('response tramnslate =>> ', response);
        let d= response.length>25 ? response.substr(0,25) + '...' : response;
        this.notifications[i].messages = d;
      })
    }
  }
}
