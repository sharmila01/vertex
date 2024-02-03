import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-in-view-withdraw-transfer',
  templateUrl: './in-view-withdraw-transfer.component.html',
  styleUrls: ['./in-view-withdraw-transfer.component.css']
})
export class InViewWithdrawTransferComponent implements OnInit {
  public isLoading: boolean = false;
  withdrawTxnDet: any = {}
  constructor(private service: MainService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')
    this.withdrawTxnDetApi(id)
  }

  withdrawTxnDetApi(txnId) {
    this.isLoading = true;
    let data = {
      id: txnId
    }
    this.service.postApi(`institutional-refund-payment-view`, data, 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        this.withdrawTxnDet = response.body.data
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false
      this.service.toastrErr(`Something went wrong`)
    })
  }
  goBack() {
    window.history.back()
  }
  openEther(txId, symbol = '') {
    this.service.openEtherPage(txId, symbol)
  }

}
