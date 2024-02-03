import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { MainService } from '../../providers/mainService.service';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
declare var $: any;
@Component({
  selector: 'app-buy-token',
  templateUrl: './buy-token.component.html',
  styleUrls: ['./buy-token.component.css']
})
export class BuyTokenComponent implements OnInit {
  cryptoCurrencyID : string;
  bankTransferID : string;
  currId;
  currStatus;
  paymentType;
  constructor(private route: ActivatedRoute, private service: MainService, private router: Router) {
    window.scrollTo(0, 0)

  }
  ngOnInit() {
    this.cryptoCurrencyID = localStorage.getItem("Cryptocurrency");
    this.bankTransferID = localStorage.getItem("bankTransfer");
    
    this.route.params.subscribe(params => {
      this.currId = params[`id`];
      this.currStatus = atob(params['status']);
      this.paymentType = params[`type`];
    })

  }

}