import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-in-view-fund-transfer',
  templateUrl: './in-view-fund-transfer.component.html',
  styleUrls: ['./in-view-fund-transfer.component.css']
})
export class InViewFundTransferComponent implements OnInit {
  public isLoading:boolean = true;
  fundDet: any = {}
  constructor(private service: MainService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')
    // console.log('id => ', id)
    this.fundDetApi(id)
  }
  fundDetApi(currId) {
    let data = {
      id: currId
    }
    this.isLoading = true;
    this.service.postApi(`institutional-approval-payment-view`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.fundDet = response.body.data
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }
  goBack() {
    window.history.back()
  }
  openEther(txId, symbol='') {
    // window.open(`https://ropsten.etherscan.io/tx/${txId}`)
    this.service.openEtherPage(txId, symbol)
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
