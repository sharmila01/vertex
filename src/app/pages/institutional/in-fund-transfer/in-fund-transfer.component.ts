import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';

declare var $: any;
@Component({
  selector: 'app-in-fund-transfer',
  templateUrl: './in-fund-transfer.component.html',
  styleUrls: ['./in-fund-transfer.component.css']
})
export class InFundTransferComponent implements OnInit {
  public isLoading:boolean = false;
  filter: any = { search: '', currPage: 1 };
  fundArr: any = [];
  paginationData: any = {};
  // symbolArr: any = []
  currModalData: any = {eth_address: null};
  constructor(private service: MainService) { }

  ngOnInit() {
    // await this.getPlatformApi()
    this.fundApi(1)
  }
  fundApi(val) {
    let url = '';
    let data = {
      page: this.filter.currPage
    }
    if(val == 1) {
      url = `institutional-approval-txn`
    } else {
      url = `institutional-appr-txn-search`
      data['search'] = this.filter.search
    }
    this.isLoading = true;
    this.service.postApi(url, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        // Commented that is previouly done for making two rows for a single offering (row)
        /* let fundArr = response.body.data
        this.fundArr = []
        fundArr.forEach(element => {
            this.fundArr.push(...[element, element])
        }); 
        this.paginationData = Object.assign({}, {page: response.body.pagination_data.page, pages: response.body.pagination_data.pages, limit: response.body.pagination_data.limit * 2, total: response.body.pagination_data.total * 2})
        */
        this.fundArr = response.body.data;
        this.paginationData = response.body.pagination_data
        
      } else {
        this.service.toastrErr(`Something went wrong`)
        this.fundArr = []
        this.paginationData = {}
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
      this.fundArr = []
      this.paginationData = {}
    })
  }

  changePage(page) {
    this.filter.currPage = page;
    this.filter.search ? this.fundApi(2) : this.fundApi(1)
  }

  onSearch() {
    this.filter.currPage = 1
    this.filter.search ? this.fundApi(2) : this.fundApi(1)
  }

  updateFund(item, val) {
    // console.log(item)
    if(!(item.transcation_id && item.eth_transcation_id)) {
      let data = {
        id: item.id,
        eth_address: item.eth_address
      }
      if(val == 2)
        $('#qr_offering_modal1').modal('hide')
        this.isLoading = true;
      this.service.postApi(`offering-approval-fund-scan`, data, 1).subscribe(response => {
        this.isLoading = false;
        if(response.status == 200) {
          let index = this.fundArr.findIndex(x => x.id == item.id)
          if(index != -1) {
            this.fundArr[index] = response.body.data
            // this.fundArr[index+1] = response.body.data
          }
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
        
      }, error => {
        this.isLoading = false;
        if(error.status != 404)
          this.service.toastrErr(`Something went wrong`)
      })
    }
  }
  payFund(item) {
    // console.log(item)
    if(item.is_live) {
      this.service.toastrErr(`You have already paid`)
    } else if(item.is_cancel || item.is_closed || item.soft_close) {
      this.service.toastrErr(`Your offering is closed or cancelled so you can not pay`)
    } else {
        this.currModalData = Object.assign({}, { eth_address: item.eth_address, eth: item.eth_pay,  token: item.token_pay, token_name: item.ticker, id: item.id, ticker: item.fund_ticker, btc_pay: item.btc_pay })
        $('#qr_offering_modal1').modal({backdrop: 'static'})

    }
  }
  openEther(txId, symbol = '') {
    // window.open(`https://ropsten.etherscan.io/tx/${txId}`)
    this.service.openEtherPage(txId, symbol)
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
  }
  getSymbol(symbol) {
    let arr =  this.symbolArr.filter(x => x['id'] == symbol)
    return arr.length?  arr[0].acceptable_token_symbol : ''
  } */
  copyToClipboard(text) {
    this.service.copyToClipboard(text);
  }
  
  isBTCTransaction(item) {
    if(item.transaction_status) {
      let ind = item.transaction_status.search('BTC')
      return ind == -1 ? 'ETH' : 'BTC'  
    } else {
      return 'ETH'
    }
    
  }
}
