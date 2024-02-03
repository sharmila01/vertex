import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../../../providers/mainService.service';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
import { ReCaptchaComponent } from 'angular2-recaptcha';
declare var $: any;
declare var web3: any;
@Component({
  selector: 'app-in-add-project',
  templateUrl: './in-add-project.component.html',
  styleUrls: ['./in-add-project.component.css']
})
export class InAddProjectComponent implements OnInit {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  captchaToken: any = '';
  public isLoading:boolean = true;
  addProjectForm: FormGroup;
  currId: any = ''
  countryListArr: any = []
  ratingErr: string = '' ;
  // invRatingErr: string = ''
  platformArr: any = []
  marketArr: any = ['Initial', 'Secondary', 'Third', 'Future']
  tokenTypeArr: any = ['Security', 'Utility', 'Other']
  yesnoArr: any = ['Yes', 'No']
  imagesArr: any = [];
  startDateOptions: INgxMyDpOptions = {
    dateFormat: 'yyyy-mm-dd'
  }
  orgImgArr: any = []
  
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private service: MainService) { }

  async ngOnInit() {
    this.currId = this.route.snapshot.paramMap.get('id')
    
    
    this.addProjectForm = this.fb.group({
      tokenName: [ '', Validators.compose([ Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9,$#&^.@!/'-\s]*$/) ]) ],
      tokenType: [null],
      contractAdd: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9,$#&^.@!/'-]*$/)])],
      decimals: ['', Validators.compose([ Validators.pattern(/^(?=.*[1-9])\d{1,10}$/) ])],
      video: ['', Validators.compose([ Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      description: ['',  Validators.compose([ Validators.pattern(/^\S.+\S$/) ]) ],
      rating: ['', Validators.compose( [ Validators.pattern(/^(?=.*[1-5])\d+(\.\d{1,2})?$/) ] )],
      ticker: [ '', Validators.compose([ Validators.required, Validators.pattern(/^[^\s][a-zA-Z0-9]*$/) ]) ],
      platform: [null, Validators.required],
      country:  [null],
      ceo: [ '', Validators.compose([ Validators.pattern(/^[^\s][a-zA-Z\s]*$/) ]) ],
      runProduct: [null],
      investor: [ '', Validators.compose([ Validators.pattern(/^[^\s][a-zA-Z,\s]*$/) ]) ],
      whitepaper: ['', Validators.compose([ Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      websiteLink: ['', Validators.compose([ Validators.required,  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      // invdeck: ['', Validators.compose([ Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      invRating: ['',  Validators.compose([ Validators.pattern(/^\S.+\S$/) ]) ],// /^[^\s][a-zA-Z0-9\s,.@!/'-_]*$/  
      marketType: [null],
      image: [''],
      circulationSupply: ['', Validators.compose([ Validators.pattern(/^(?=.*[1-9])\d{1,10}$/) ])],
      fundRaised: ['', Validators.compose([ Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,10})?$/)  ])],
      whatDo: ['', Validators.compose([ Validators.pattern(/^\S.+\S$/) ]) ],
      startDate: [''],
      fbLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      instaLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      twitterLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      teleLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      mediumLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      bitcoinLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      youtubeLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      redditLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      githubLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])],
      linkedinLink: ['', Validators.compose([  Validators.pattern(/^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/) ])]
    })
    await this.getPlatformApi()
    // await this.countryListApi()
    this.countryListArr = this.service.countryList
    this.currId == 'add' ? '' : this.projectDetailApi()
  }
  // ************* Country List JSON ***********************
  countryListApi() {
    // return new Promise((resolve, reject) => {
    //   this.service.getCountriesJson().subscribe(response => {
    //     this.countryListArr = response.countries
    //     resolve(true)
    //   }, error => {
    //     this.service.toastrErr(`Something went wrong`)
    //   })
    // })
    this.countryListArr = this.service.countryList
  }
  // ************ End Country List JSON ********************
  fileChangeEvent(event, type) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = ((e: any) => {
        // console.log(e.target.result)
        if(type == 1) {
          this.addProjectForm.controls['image'].setValue(e.target.result)
        } else if(type == 2) {
          this.imagesArr.push(e.target.result)
        }
        
      })
      reader.readAsDataURL(event.target.files[0])
    }
  }
  get form() {
    return this.addProjectForm.controls;
  }

  ratingValChange(val) {
    if(Number(val) && Number(val) <= 5) {
      this.ratingErr = ''
    } else {
      this.ratingErr = 'Please enter valid rating.'
    }
  }

  /* invRatingValChange(val) {
    if(Number(val) && Number(val) <= 5) {
      this.invRatingErr = ''
    } else {
      this.invRatingErr = 'Please enter valid rating.'
    }
  } */
  getPlatformApi() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.service.getApi(`get-platform`, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.platformArr = response.body.data
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

  onAddProject() {
    // console.log(this.imagesArr)
    // return;
    this.captchaToken = this.captcha.getResponse();
    this.captcha.reset();
    if(!this.captchaToken) {
      this.service.toastrErr(`Please verify captcha`)
      return;
    }
      
    let formVal = this.addProjectForm.value
    // console.log(formVal)
    
    let data = {
      token_symbol: formVal.image.split(';base64,').length > 1 ? formVal.image.split(';base64,')[1] : undefined,
      token_name: formVal.tokenName ? formVal.tokenName : undefined,
      token_type: formVal.tokenType ? formVal.tokenType : undefined,
      contract_address: formVal.contractAdd ? formVal.contractAdd : undefined,
      decimals: formVal.decimals ? formVal.decimals : undefined,
      video_url: formVal.video ? formVal.video : undefined,
      description: formVal.description ? formVal.description : undefined,
      rating: formVal.rating? formVal.rating : undefined ,
      ticker: formVal.ticker ? formVal.ticker : undefined, 
      platform: formVal.platform ? formVal.platform : undefined,
      country: formVal.country ? formVal.country : undefined,
      ceo_name: formVal.ceo ? formVal.ceo : undefined,
      running_product: formVal.runProduct ? formVal.runProduct : undefined,
      known_investors: formVal.investor ? formVal.investor : undefined,
      whitepaper_link: formVal.whitepaper ? formVal.whitepaper : undefined,
      // yellow_paper_link: formVal.yellowpaper,
      website_link: formVal.websiteLink ? formVal.websiteLink : undefined,
      // investment_deck_link: formVal.invdeck,
      investment_rating: formVal.invRating ? formVal.invRating : undefined,
      market_type: formVal.marketType ? formVal.marketType : undefined,
      circulation_supply: formVal.circulationSupply ? formVal.circulationSupply : undefined,
      fund_raised: formVal.fundRaised ? formVal.fundRaised : undefined,
      what_token_do: formVal.whatDo ? formVal.whatDo : undefined,
      project_start_date: formVal.startDate.formatted ? formVal.startDate.formatted : undefined,
      facebook_link: formVal.fbLink ? formVal.fbLink : undefined,
      instagram_link: formVal.instaLink ? formVal.instaLink : undefined,
      twitter_link:  formVal.twitterLink ? formVal.twitterLink : undefined,
      telegram_link: formVal.teleLink ? formVal.teleLink : undefined,
      medium_link:  formVal.mediumLink ? formVal.mediumLink : undefined,
      bitcointalk_link: formVal.bitcoinLink ? formVal.bitcoinLink : undefined,
      youtube_link: formVal.youtubeLink ? formVal.youtubeLink : undefined,
      reddit_link: formVal.redditLink ? formVal.redditLink : undefined,
      github_link: formVal.githubLink ? formVal.githubLink : undefined,
      linkedin_link: formVal.linkedinLink ? formVal.linkedinLink : undefined,
      gallery: this.imagesArr.filter(x => {
        if(!x.id)
          return true;
      })
    }
    console.log(data)
    // return;
    let url = ``
    if(this.currId == 'add') {
      url = `institutional-project-create`
     
    } else {
      url = `institutional-project-update`
      data['project_id'] = this.currId
  
    }
    console.log('add project form => '+ JSON.stringify(data))
    this.isLoading = true;
    this.service.postApi(url, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200 || response.status == 201) {
        $('#in_add_project').modal({backdrop: 'static'})
        // this.service.toastrSucc(response.body.message)
        // window.history.back()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }
  goBack() {
    window.history.back()
  }

  goToProject() {
    $('#in_add_project').modal('hide')
    window.history.back()
  }

  // ******************** Project Detail Api ********************************** //
  projectDetailApi() {
    let data = {
      project_id: this.currId
    }
    this.isLoading = true;
    this.service.postApi(`institutional-project-details`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        // if(response.body.data.length)
        let projectDet = response.body.data
        this.addProjectForm.patchValue({
          image: projectDet.token_symbol,
          tokenName: projectDet.token_name || '',
          tokenType: projectDet.token_type || null,
          contractAdd: projectDet.contract_address || '',
          decimals: projectDet.decimals || '',
          video: projectDet.video_url || '',
          description: projectDet.description || '',
          rating: projectDet.rating || '',
          ticker: projectDet.ticker || '',
          platform: projectDet.platform || null,
          country: projectDet.country || null,
          ceo: projectDet.ceo_name || '',
          runProduct: projectDet.running_product || null,
          investor: projectDet.known_investors || '',
          whitepaper: projectDet.whitepaper_link || '',
          websiteLink: projectDet.website_link || '',
          // invdeck: projectDet.investment_deck_link,
          invRating: projectDet.investment_rating || '',
          // thirdMarket: projectDet.third_market,
          marketType: projectDet.market_type || null,
          circulationSupply: projectDet.circulation_supply || '',
          fundRaised: projectDet.fund_raised || '',
          whatDo: projectDet.what_token_do || '',
          fbLink: projectDet.facebook_link || '',
          instaLink: projectDet.instagram_link || '',
          twitterLink: projectDet.twitter_link || '',
          teleLink: projectDet.telegram_link || '',
          mediumLink: projectDet.medium_link || '',
          bitcoinLink: projectDet.bitcointalk_link || '',
          youtubeLink: projectDet.youtube_link || '',
          redditLink: projectDet.reddit_link || '',
          githubLink: projectDet.github_link || '',
          linkedinLink: projectDet.linkedin_link || ''
        })
        this.imagesArr = response.body.gallery_data
        if(projectDet.project_start_date) {
          this.addProjectForm.patchValue({
            startDate: {
              formatted: projectDet.project_start_date,
              date: {
                year: Number(projectDet.project_start_date.split('-')[0]),
                month: Number(projectDet.project_start_date.split('-')[1]),
                day: Number(projectDet.project_start_date.split('-')[2])
              }
            },
          })
        } else {
          this.addProjectForm.patchValue({
            startDate: null
          })
        }
        
        // if(Array.isArray(response.body.gallery_data))
        //   this.imagesArr = response.body.gallery_data.map(x => x.image)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 404) {
        this.service.toastrErr(error.error.message)
        window.history.back()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }
  // ******************** End Project Detail Api ******************************** //

  removeImg(obj, ind) {
    if(obj.id) {
      console.log(obj.id)
      let data = {
        id: Number(obj.id)
      }
      this.service.postApi(`delete-project-gallery`, data, 1).subscribe(response => {
        if(response.status == 200) {
          this.service.toastrSucc(response.body.message)
          let ind = this.imagesArr.findIndex(x => x.id == obj.id)
          console.log('deleted inde => ' , ind)
          if(ind != -1)
            this.imagesArr.splice(ind, 1)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        // this.isLoading = false;
        if(error.status == 404) {
          this.service.toastrErr(error.error.message)
        } else this.service.toastrErr(`Something went wrong`)
        
      })
    } else {
      this.imagesArr.splice(ind, 1)
    }
  }
  setUpperCaseValue(val) {
    this.addProjectForm.controls['ticker'].setValue(val.toUpperCase())
  }
  checkCAddress(address) {
    console.log('address => ', address);
    let val = web3.isAddress(address)
    console.log('ewb3 => ', val);
  }
  
}
