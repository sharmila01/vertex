import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { MainService } from '../../providers/mainService.service';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
declare var $: any;
@Component({
  selector: 'app-crypto-token',
  templateUrl: './crypto-token.component.html',
  styleUrls: ['./crypto-token.component.css']
})
export class CryptoTokenComponent implements OnInit {
  public isLoading:boolean = false;
  currId: any;
  minimum_amount:number;
  tokenDet: any = {};
  tokenVal: any = '1';
  vertexVal: any = '1';
  error: any = {"errMsg": ""}
  profileData = {}
  angularxQrCode: any = null;
  currBal = {val: 0, show: false, isScan: false, showTimer: true, isScanning: false, showScan: false }
  // currBal = {val: 0, show: false, isScan: false, showTimer: true, isScanning: false, showScan: false }
  trans =  {isDone: 1};
  transFinal = {};
  isTokenSent = false;
  errormsg = false;
  currStatus: any = '';
  isCancel: any = false;
  transactionFee: any= 0;
  usdAmount: any = '';
  searchVal = new Subject();
  percent: any;
  tog: number = 0;
  totalQuantity: any;
  istoken:boolean = true;
  allowContinue: boolean;
  // interval: any
  // transaction = {"isTransaction": false}
  constructor(private route: ActivatedRoute, private service: MainService, private router: Router) {
    window.scrollTo(0, 0)
    
  }
  ngOnInit() {
    // Disable inspect element
   /*  $(document).bind("contextmenu",function(e) {
      console.log('menu')
      e.preventDefault();
    });
    $(document).keydown(function(e){
        if(e.which === 123){
            return false;
        }
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
          return false;
       }
       if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
          return false;
       }
       if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
          return false;
       }
       if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
          return false;
       }
    }); */
    // Debounce Time Code
    this.searchVal.debounceTime(500).distinctUntilChanged().subscribe(res => {
  		console.log('search => ', res);
      this.tokenVal = res
      this.tokenValChange()
    })
    // let url = 'a'
    /* this.router.events.subscribe((e: any ) => {
      if(e instanceof RoutesRecognized) {
        console.log('routes buy token => ', e)
        url = e.url.split('/')[1]
      }
    })
    console.log('urlllll => ', url)
    if(url == 'a') {
      this.getProfileApi(3)
      return;
    } else if(url != 'buy-token') {
      return;
    } */
    
    // End Debounce Time Code
    // window.addEventListener("beforeunload", function (e) {
    //   console.log('reloading')
    //   return;
    // })
    this.allowContinue = true;
    this.route.params.subscribe(params => {
      this.currId = params[`id`]
      this.currStatus = atob(params['status'])
      // console.log("CurrStatus---->>>>  ",this.currStatus);
      if(this.currStatus == 'no') {
        // console.log("CurrStatus---->>>>  ",this.currStatus);
        // Buy Order Case
        this.isCancel = true
        if(!Object.keys(this.service.buyTokenAlready).length) this.tokenDetailApi()
        else {
          this.tokenDet = Object.assign({}, this.service.buyTokenAlready)
          this.angularxQrCode = this.tokenDet['order-data']['admin_address']
          this.tokenValChange()
          this.currBal['orderTime'] = new Date(this.tokenDet['order-data']['order_created_at'])
          this.currBal['orderTime'].setTime(this.currBal['orderTime'].getTime() + (10 * 59 * 1000));          
          let nowUtc = new Date()
          if(nowUtc.getTime() -  this.currBal['orderTime'].getTime() < 0 )
            this.currBal['time'] = new Date('1-1-1970').setMilliseconds(this.currBal['orderTime'].getTime() - nowUtc.getTime()) 
          this.service.interval = setInterval(() => {
            this.currBal['time'] = this.currBal['time'] - 1000
            let date = new Date()
            if(date.getTime() -  this.currBal['orderTime'].getTime() >= 0) {
              clearInterval(this.service.interval)
              this.currBal.showTimer = false
              this.closeOrderApi()
            }
          }, 1000)
        }
        
      } else {
        // console.log("CurrStatus---->>>>  ",this.currStatus);
        // Coming from transaction history case
        // console.log('from transaction history')
        if(this.currStatus == 'Cancelled' || this.currStatus == 'Closed') {
          // console.log("CurrStatus---->>>>  ",this.currStatus);
          this.isTokenSent = true
          this.currBal.showTimer = false
          this.isCancel = false
          this.currBal.showScan = false
        } else if(this.currStatus == 'Fund Sent' || this.currStatus == 'Order Completed' || this.currStatus == 'Tokens Received' || this.currStatus == 'Fund Received') {
        //  console.log('curr status => ', this.currStatus)
          this.isTokenSent = true
          this.isCancel = false
          this.currBal.showTimer = false
          this.currBal.showScan = true

        } else if(this.currStatus == 'Not Confirmed') {
          // console.log("CurrStatus---->>>>  ",this.currStatus);
          this.isCancel = true
          var time ;
          
        }
        this.viewOrderApi();
      }
      
    })

    

  }
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
  
  tokenDetailApi() {
  	let data = { "id": this.currId }
    this.isLoading = true;
    this.service.postApi(`buy-token-detail`, data, 1).subscribe(response => {
      console.log('response', response)
      this.isLoading = false;
      if(response.status == 200) {
        this.tokenDet = response.body
        this.angularxQrCode = this.tokenDet['order-data']['admin_address']
        this.tokenValChange()
        this.currBal['orderTime'] = new Date(this.tokenDet['order-data']['order_created_at'])
        this.currBal['orderTime'].setTime(this.currBal['orderTime'].getTime() + (10 * 59 * 1000));          
        let nowUtc = new Date()
        if(nowUtc.getTime() -  this.currBal['orderTime'].getTime() < 0 )
          this.currBal['time'] = new Date('1-1-1970').setMilliseconds(this.currBal['orderTime'].getTime() - nowUtc.getTime()) 
        this.service.interval = setInterval(() => {
          this.currBal['time'] = this.currBal['time'] - 1000
          let date = new Date()
          if(date.getTime() -  this.currBal['orderTime'].getTime() >= 0) {
            clearInterval(this.service.interval)
            this.currBal.showTimer = false
            this.closeOrderApi()
          }
        }, 1000)

      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
        window.history.back()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }
   viewOrderApi() {
     console.log("ViewOrderApi 1 ",this.currStatus)
    let data = {
      "order_id": this.currId,
      "transaction_status": this.currStatus
    }
    this.isLoading = true;
    this.service.postApi(`view-order`, data, 1).subscribe(async response => {
      this.isLoading = false;
      if(response.status == 200) {
        console.log("ViewOrderApi 2 ",this.currStatus)
        // console.log(JSON.stringify(response))
        this.tokenDet = response.body
        this.angularxQrCode = this.tokenDet['order-data']['admin_address']

        

        if(this.currStatus == 'Fund Sent' || this.currStatus == 'Order Completed'|| this.currStatus == 'Tokens Received' || this.currStatus == 'Fund Received') {
          console.log("ViewOrderApi 3 ",this.currStatus)
          this.tokenValChangeShow();
          
          /* if(this.currStatus == 'Order Completed' || this.currStatus == 'Tokens Received') {
            this.vertexVal = this.tokenDet['order-data']['fund_received']
            this.tokenVal = this.tokenDet['order-data']['token_quantity']
           
          } else {
            this.tokenValChange()
          } */
          if(this.tokenDet['order-data']['incoming_transcation'] == null) {
            this.trans.isDone = 1
          } else if(this.tokenDet['order-data']['incoming_transcation'] != null && this.tokenDet['order-data']['outgoing_transcation'] == null) {
            this.transFinal = this.tokenDet['order-data']
            this.tokenDet['order-data']['outgoing_transcation'] = 'Processing'
            this.trans.isDone = 3
          } else {
            // console.log('834618469')
            this.transFinal = this.tokenDet['order-data']
            this.trans.isDone = 3
          }
        } else if(this.currStatus == 'Not Confirmed') {
          // console.log('token created at =>> ',this.tokenDet['order-data']['order_created_at'])
          this.tokenValChange()
          this.currBal['orderTime'] = new Date(this.tokenDet['order-data']['order_created_at'])
          //  this.currBal['orderTime'] = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

          // console.log('time => ', this.currBal['orderTime']);
          this.currBal['orderTime'].setTime(this.currBal['orderTime'].getTime() + (10 * 60 * 1000));
          // console.log('updated time  =>> ', this.currBal['orderTime'])
          
          
          let nowUtc = new Date()
          if(nowUtc.getTime() -  this.currBal['orderTime'].getTime() < 0 )
            this.currBal['time'] = new Date('1-1-1970').setMilliseconds(this.currBal['orderTime'].getTime() - nowUtc.getTime()) 
              // this.currBal['time'] = new Date('1-1-1970').setMilliseconds(nowUtc.getTime() -  this.currBal['orderTime'].getTime()) 
              // console.log('diff =>> ', nowUtc.getTime() -  this.currBal['orderTime'].getTime())
          this.service.interval = setInterval(() => {
            this.currBal['time'] = this.currBal['time'] - 1000
            let date = new Date()
            // this.currBal['orderTime'].setTime(this.currBal['orderTime'].getTime() + (10 * 60 * 1000));
            
            
            // var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            // this.currBal['time'] = new Date(nowUtc.getTime() -  this.currBal['orderTime'].getTime())
            
            // if(nowUtc.getTime() -  this.currBal['orderTime'].getTime() < 600000 )
              // this.currBal['time'].setMilliseconds(nowUtc.getTime() -  this.currBal['orderTime'].getTime())  
            // console.log('remaining time ===>> ', this.currBal['time'])
            // console.log('curr date => ',nowUtc)
            // console.log('static date => ', this.currBal['orderTime'])
            if(date.getTime() -  this.currBal['orderTime'].getTime() >= 0) {
              clearInterval(this.service.interval)
              this.currBal.showTimer = false
              this.closeOrderApi()
              // this.service.toastrErr('Your time of 10 minutes to buy token has been expired')
              // window.history.back()
            }
          }, 1000)
        } else {
          this.tokenValChangeShow()
        }
        
        
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

  tokenValChangeShow() {
    // console.log("tokenValChangeShow",this.currStatus)
    if(this.tokenDet['order-data'].buy_token) {
      this.tokenVal = this.tokenDet['order-data'].buy_token
      this.transactionFee = this.tokenDet['order-data'].buy_token_fee
      if(this.currStatus == 'Fund Sent') {
        this.vertexVal = Number(this.tokenVal) * this.tokenDet['order-data'].token_price;
      } else {
        // Fund Received && Order Completed
        this.vertexVal = Number(this.tokenDet['order-data'].fund_received) - Number(this.tokenDet['order-data'].buy_token_fee)
      }
      // this.vertexVal = Number(this.tokenVal) * this.tokenDet['order-data'].token_price;
      // this.vertexVal = this.tokenDet['order-data'].buy_token_price
      // this.transactionFee = this.tokenDet['order-data'].buy_token_fee

      // Now added 
      
      this.tokenValChange1(this.vertexVal);
    } else {
      // console.log("else")
      this.vertexVal = Number(this.tokenVal) * this.tokenDet['order-data'].token_price;
      this.tokenValChange1(this.vertexVal);
      this.error.errMsg = ''
    }
  }
  decimalPlaces(num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
         0,
         // Number of digits right of decimal point.
         (match[1] ? match[1].length : 0)
         // Adjust for scientific notation.
         - (match[2] ? +match[2] : 0));
  }
  async tokenValChange() {
  // console.log("TokenVal-->> ",this.tokenVal)
    try {
      this.totalQuantity = await this.getTotalAmountApi()
      if(this.tokenVal && this.tokenVal.match(/^(\d+\.?\d*|\.\d+)$/) && Number(this.tokenVal) <= this.totalQuantity  )  {
        this.vertexVal = Number(this.tokenVal) * this.tokenDet['order-data'].token_price
        this.error.errMsg = ''
        this.tokenValChange1(this.vertexVal)
      } else {
        this.vertexVal = '0'
        if(Number(this.tokenVal) > this.totalQuantity) {
          this.error.errMsg = "Please enter quantity less than available supply for that offering"
        } else {
          this.error.errMsg = 'Please enter valid number'
        }        
      }
    } catch(error) {
      this.service.toastrErr(`Something went wrong`);
    }   
    
  }
  getTotalAmountApi() {
    return new Promise((resolve, reject) => {
      let data = {
        offering_id: this.currId
      }
      if(this.currStatus == 'Not Confirmed') {
        data['offering_id'] = this.tokenDet['token']['id']
      }
      this.service.postApi(`total-token-available`, data, 1).subscribe(response => {
        if(response.status == 200) {
          resolve(response.body.token_quantity)
        } else {
          reject(false)
        }
      }, error => {
        reject(false)
      })
    })
    
  }
  tokenValChange1(val) {
    // console.log("Valll--->> ",val);
    // if(this.tokenVal && this.tokenVal.match(/^(\d+\.?\d*|\.\d+)$/)) {
     /*  if(Number(this.tokenVal) < 50) {
        this.vertexVal = '0'
      }else{ */
        this.errormsg = false;
        let data =  {
          amount: parseFloat((Number(val)).toFixed(10))|| val,//Number(this.tokenVal) * this.tokenDet['order-data'].token_price,
          symbol: this.tokenDet.token.symbol_name
        }
        this.isLoading = true;
        this.service.postApi(`calculate-price`, data, 1).subscribe(response => {
          this.isLoading = false;
          if(response.status == 200) {
            // console.log("Response Cal",JSON.stringify(response.body));
            this.percent = response.body.percent
            this.usdAmount = response.body.usd_amount?response.body.usd_amount.toFixed(2):0;
            if(this.currStatus != 'Order Completed' && this.currStatus != 'Fund Received')
            this.transactionFee = response.body.fee;
            this.getMinimumPurchaceAmount();
            // this.vertexVal = response.body.price
            /* if(response.body.price.toString().split(".").length > 1) {
              this.vertexVal = response.body.price.toString().split(".")[1].length > 5 ? parseFloat(response.body.price).toFixed(5) : response.body.price
            } */
            this.error.errMsg = ''
          } else {
  
          }
        } ,error => {
          this.isLoading = false;
  
        })
      // } 
      // }
      

  }
  async changeTokenSent() {
    this.istoken = false;
    // this.tokenValChange()
    try {
      this.totalQuantity = await this.getTotalAmountApi()
      if(this.tokenVal && this.tokenVal.match(/^(\d+\.?\d*|\.\d+)$/) && Number(this.tokenVal) <= this.totalQuantity  )  {
        this.vertexVal = Number(this.tokenVal) * this.tokenDet['order-data'].token_price
        this.error.errMsg = ''
        this.tokenValChange1(this.vertexVal)
      } else {
        this.vertexVal = '0'
        if(Number(this.tokenVal) > this.totalQuantity) {
          this.error.errMsg = "Please enter quantity less than available supply for that offering"
        } else {
          this.error.errMsg = 'Please enter valid number'
        }        
      }
      // await this.getTotalAmountApi()
      // if(Number(this.tokenVal) < 50){
      if(this.error.errMsg || this.usdAmount < 5) {
        this.service.toastrErr(`Please fill tokens purchase details correctly`)
        // this.errormsg = true;
      }
      else {
        this.errormsg = false;
        let tokenSentData = {
          "order_id": this.tokenDet['order-data']['order_id'],
          "buy_token": this.tokenVal,
          "buy_token_price": parseFloat((Number(this.vertexVal)).toFixed(10)) || this.vertexVal,
          "buy_token_fee": this.transactionFee
        }
        this.isLoading = true;
        // this.service.spinnerShow()
        this.service.postApi(`token-sent`, tokenSentData, 1).subscribe(response => {
          this.isLoading = false;
          this.errormsg = false;
          this.istoken = false;
          // this.service.spinnerHide()
          if(response.status == 200) {
            this.isTokenSent = true;
            clearInterval(this.service.interval)
            this.currBal.showTimer = false
            this.currBal.showScan = true
            this.errormsg = false;
            if(this.currStatus == 'Not Confirmed') {
              this.router.navigate(['/buy-token', this.currId, btoa('Fund Sent'),1])
            } else if(this.currStatus == 'no') {
              this.isCancel = false
            }
          } else {
            this.service.toastrErr(`Something went wrong`)
          }
        }, error => {
          this.isLoading = false;
          // this.service.spinnerHide()
          if(error.status != 401) {
            this.service.toastrErr(`Something went wrong`)
          }
        })
      }
    } catch(error) {
      this.service.toastrErr(`Something went wrong`);
    }

    
  }

  scan() {
    this.currBal.isScan = true
    this.trans.isDone = 2
    let scanData = { "order_id": this.tokenDet['order-data']['order_id'] }
    this.service.postApi(`scan-txn`, scanData, 1).subscribe(response => {
      if(response.status == 200) {
        this.transFinal = response.body['txn-data'][0]
        if(this.transFinal['incoming_transcation'] == null) {
          setTimeout(() => {
            this.trans.isDone = 1
            this.currBal.isScan = false  
          }, 5000)
        } else if(this.transFinal['incoming_transcation'] != null && this.transFinal['outgoing_transcation'] == null) {
          this.transFinal['outgoing_transcation'] = 'Processing'
          setTimeout(() => {
            this.trans.isDone = 3
            this.currBal.isScan = false
          }, 5000)
        } else {
          setTimeout(() => {
            this.trans.isDone = 3
            this.currBal.isScan = false
          }, 5000)
        }
      } else {
        setTimeout(() => {
          this.trans.isDone = 1
          this.currBal.isScan = false
          this.service.toastrErr(`Something went wrong`)
        }, 5000)
      }
    }, error => {
      setTimeout(() => {
        this.trans.isDone = 1
        this.currBal.isScan = false
        this.service.toastrErr(`Something went wrong`)
      }, 5000)
    })
  }

  cancelOrder() {
    // this.currId = (this.currStatus == 'no') ? this.tokenDet['order-data']['order_id'] : this.currId
    let cancelData = {}
    if(this.currStatus == 'no') {
      cancelData =   { "order_id": this.tokenDet['order-data']['order_id'] }
    } else {
      cancelData = { "order_id": this.currId }
    }
    this.isLoading = true;
    // this.service.spinnerShow()
    this.service.postApi(`cancel-order`, cancelData, 1).subscribe(response => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        window.history.back()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      // this.service.spinnerHide()
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }
  getLocalString(item) {
    if(item)
      return item.toLocaleString()
    else 
      return 0
  }
  openEther(txId, symbol = '') {
    // window.open(`https://ropsten.etherscan.io/tx/${txId}`)
    this.service.openEtherPage(txId, symbol)
  }
  toggle() {
    if(this.tog == 0){
      this.tog = 1;
    }
    else {
      this.tog = 0;
    }
  }
  
  checkBalance() {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      this.service.getApi(`check-vtx-tkn`, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          this.currBal.show = true
          this.currBal.val = response.body.data
          // this.currBal.canTransact = true
          resolve(true)
        } else {
          this.currBal.show = false
          this.currBal.val = 0
          // this.currBal.canTransact = false
          reject(false)
        }
      }, error => {
        this.isLoading = false;
        this.currBal.show = false
        this.currBal.val = 0
        // this.currBal.canTransact = false
        this.service.toastrErr('Something went wrong')
        reject(false)
      })
    })
    
  }
  async transaction() {
    let vat = await this.checkBalance()
    // console.log(this.currBal.val)
    // if(!this.currBal.canTransact) {
    //   this
    // }
    // console.log((Number(this.currBal.val) > Number(this.vertexVal)) && !this.error.errMsg)
    if((Number(this.currBal.val) > Number(this.vertexVal)) && !this.error.errMsg) {
      let transData = {"id": this.currId, "quantity": this.tokenVal, "required_vtx_tkn": this.vertexVal}
      this.isLoading = false;
      // this.service.spinnerShow()
      this.service.postApi(`transfer-token`, transData, 1).subscribe(response => {
        // console.log(JSON.stringify(response))
        this.isLoading = false;
        // this.service.spinnerHide()
        if(response.status == 200) {
          this.service.toastrSucc(response.body.message)
          this.router.navigate(['/home'])
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        // console.log(JSON.stringify(error))
        this.isLoading = false;
        // this.service.spinnerHide()
        if(error.status == 400) {
          this.service.toastrErr(error.error.message)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      })
      
    } else {
      // this.service.toastrErr(`Vertex token is not sufficient.`)
      this.service.toastrErr(`Please check token quantity and vertex balance.`)
    }
  }

  closeOrderApi () {
    // if(this.currStatus == 'no' || )
    let data = {
      "order_id": this.tokenDet['order-data']['order_id']
    }
    this.isLoading = true;
    this.service.postApi(`close-order`, data, 1).subscribe(response => {
      this.isLoading = false;
      this.service.toastrErr(`Your time of 10 minutes to buy token has been expired`)
      window.history.back()
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Your time of 10 minutes to buy token has been expired`)
      window.history.back()
    })
  }
  copyToClipboard(val) {
    this.service.copyToClipboard(val);
  }
  public getMinimumPurchaceAmount() {
    this.allowContinue = true;
    let data = {
      "offering_id": this.tokenDet['order-data']['offering_id']
    }
    this.isLoading = true;
    this.service.postApi(`minimum-amount`, data, 1).subscribe(response => {
      console.log('response', response);
      this.minimum_amount = response.body.minimum_amount;
      if (this.minimum_amount > this.usdAmount) {
        this.allowContinue = false;
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

}