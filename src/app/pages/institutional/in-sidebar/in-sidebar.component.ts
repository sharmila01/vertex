import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../providers/mainService.service';
import { InstitutionalGuard } from '../../../providers/institutional.guard';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
@Component({
  selector: 'app-in-sidebar',
  templateUrl: './in-sidebar.component.html',
  styleUrls: ['./in-sidebar.component.css']
})
export class InSidebarComponent implements OnInit {
  currentLanguage: string;
  iswebApp: boolean= false;
  public isLoading:boolean = true;
  @Input() activeTab: any;
  ether: any = ' ';
  btc: any = ' ';
  stake: any = ' ';
  txnData;
  show = true;
  filter: any = { search: '', currPage: 1 };
  incompleteTrans: any = false;
  public language;
  hide = false;
  txnArr: any = [];
  paginationData: any = {};
  profileData: any = {}
  constructor(private router: Router, private service: MainService,private inGuardService: InstitutionalGuard, 
    private translate: TranslateService) {
      debugger
    translate.addLangs(["en", "zh-Hans", "ar-sa"]);
    // translate.setDefaultLang('en');
    // this.currentLanguage = 'en';
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en-US|zh-Hans|ar-sa/) ? browserLang : 'en');
     }

  ngOnInit() {
    console.clear();
    this.txnApi(1);
    this.getScreenSize();
    $("body").addClass("perfect-scrollbar-off"); 
    $(".navbar-toggler").click(function(){
      $(this).toggleClass("toggled");
      $("body").toggleClass("nav-open");
      $(".sidebar").toggleClass("sideOpen");
      $(".main-panel").toggleClass("mainPanelAnimate");

    });


    $(document).click(function(e) {
      if (!$(e.target).is(".navbar-toggler, .navbar-toggler *, .sideOpen, .sideOpen *")) {
        $(".navbar-toggler").removeClass("toggled");
        $("body").removeClass("nav-open");
        $(".sidebar").removeClass("sideOpen");
        $(".main-panel").removeClass("mainPanelAnimate");
      }
    });
    this.getProfileApi();
  }

  // *************** Logout API ****************************
  logoutFun() {
    this.isLoading = true;
    this.service.getApi(`logout`, 1).subscribe(response => {
      // console.log(response)
      this.isLoading = false;
      $(`#logoutInst`).modal(`hide`)
      if(response.status == 200) {
        this.inGuardService.isAccess = false;
        this.service.changeSigninBs(`loggedout`)
        this.service.toastrSucc(response.body.message)
        if(localStorage.getItem(`loginToken`) != null) {
          localStorage.removeItem(`loginToken`)
        } 
          
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      // console.log(error)
      $(`#logoutInst`).modal(`hide`)
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })

    
  }
  // *************** End Logout API ****************************
 //********************************** Profile Api *************/
  getProfileApi() {
   this.service.getApi(`profile`, 1).subscribe(response => {
      this.isLoading = false;
  	  if (response.status == 200) {
        let profileData = response.body.data
        this.profileData = response.body.data
        this.ether = profileData.eth_address;
        this.btc = profileData.btc_address;
        // var stakeData = response.body.stake_data;
        // this.stake = ((stakeData.stake_address == null)||(stakeData.approved == false))?true:false
        this.stake = response.body.stake_data.stake_address
        this.service.insProfile = response.body
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
  }

  getScreenSize()  {  
    this.iswebApp = false;
    let mobWidth = (window.screen.width)  
     if(mobWidth < 1000){
       this.iswebApp = true;
     }
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
  }
  
  this.service.postApi(url, data, 1).subscribe(response => {
    this.isLoading = false;
    if(response.status == 200) {
      this.txnArr = response.body.data
      // this.paginationData = response.body.pagination_data
      this.txnData = this.txnArr.filter(
        res => res.transaction_status === 'Awaiting Payment');
        console.log('this.txnData',this.txnData);
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
}
