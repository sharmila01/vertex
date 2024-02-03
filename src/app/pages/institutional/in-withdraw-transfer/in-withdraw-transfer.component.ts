import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';

@Component({
  selector: 'app-in-withdraw-transfer',
  templateUrl: './in-withdraw-transfer.component.html',
  styleUrls: ['./in-withdraw-transfer.component.css']
})
export class InWithdrawTransferComponent implements OnInit {
  public isLoading:boolean = false;
  filter: any = { search: '', currPage: 1 };
  withdrawTxnArr: any = []
  paginationData: any = {};
  // currModalData: any = {eth_address: null};

  constructor(private service: MainService) { }

  ngOnInit() {
    this.withdrawApi(1)
  }

  // ***************  With Draw Transfer Api **************************  //
  withdrawApi(val) {
    
    let url = '';
    let data = {
      page: this.filter.currPage
    }
    if(val == 1) {
      url = `institutional-refund-txn`
    } else {
      url = `institutional-refund-txn-search`
      data['search'] = this.filter.search
    }

    this.isLoading = true;
    this.service.postApi(url, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        // let txnArr = response.body.data
        // console.log('txn arr ==== >>>>>> ', txnArr )
        // this.withdrawTxnArr = []
        /* txnArr.forEach(element => {
            this.withdrawTxnArr.push(...[element, element])
        }); */
        // this.paginationData = Object.assign({}, {page: response.body.pagination_data.page, pages: response.body.pagination_data.pages, limit: response.body.pagination_data.limit * 2, total: response.body.pagination_data.total * 2})
        this.withdrawTxnArr = response.body.data
        this.paginationData = response.body.pagination_data

      } else {
        this.service.toastrErr(`Something went wrong`)
        this.withdrawTxnArr = []
        this.paginationData = {}
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
      this.withdrawTxnArr = []
      this.paginationData = {}
    })
  }
  // ***************  End With Draw Transfer Api **************************  //

  onSearch() {
    this.filter.currPage = 1
    this.filter.search ? this.withdrawApi(2) : this.withdrawApi(1)
  }

  changePage(page) {
    this.filter.currPage = page;
    this.filter.search ? this.withdrawApi(2) : this.withdrawApi(1)
  }

  openEther(txId, symbol = '') {
    
    // window.open(`https://ropsten.etherscan.io/tx/${txId}`)
    this.service.openEtherPage(txId, symbol)
  }
  

}
