import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { MainService } from '../../../providers/mainService.service';

@Component({
  selector: 'app-in-view-order',
  templateUrl: './in-view-order.component.html',
  styleUrls: ['./in-view-order.component.css']
})
export class InViewOrderComponent implements OnInit {
  public isLoading:boolean = true;
  param: any = { id: '', status: '', backPage: '' };
  orderDet: any = {};
  tokenDet : any = {};
  cryptoCurrencyID;
  bankTransferID;
  constructor(private route: ActivatedRoute, private service: MainService) { }

  ngOnInit() {
    this.cryptoCurrencyID = localStorage.getItem("Cryptocurrency");
    this.bankTransferID = localStorage.getItem("bankTransfer");
    this.param.id = atob(this.route.snapshot.paramMap.get('id'))
    this.param.status = atob(this.route.snapshot.paramMap.get('status'))
    this.param.backPage = this.route.snapshot.paramMap.get('backPage') // 1 for dashboard and 2 for transaction history navigation
    console.log(this.param)
    this.viewOrderApi()
  }

  viewOrderApi() {
    let data = {
      order_id: this.param.id,
      transaction_status: this.param.status,
      offering_transaction: true// this.param.backPage == '1' ? true : false
    }
    this.isLoading = true;
    this.service.postApi(`institutional-user-view-order`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.orderDet = response.body['order-data']
        this.tokenDet = response.body['token']
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
  goBack() {
    window.history.back()
  }
  openEther(txId,  symbol='') {
    // window.open(`https://ropsten.etherscan.io/tx/${txId}`)
    this.service.openEtherPage(txId, symbol)
  }
  isInlcudeTokenBurning(str = '') {
    if(str && !str.includes('Token Burning'))
      return true
    else
      return false
  }

}
