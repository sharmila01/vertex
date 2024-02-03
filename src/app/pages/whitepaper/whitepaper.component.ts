import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { SeoService } from '../../providers/seo.service';

@Component({
  selector: 'app-whitepaper',
  templateUrl: './whitepaper.component.html',
  styleUrls: ['./whitepaper.component.css']
})
export class WhitepaperComponent implements OnInit {
  whitepaper : any = [];
  public isLoading: boolean = true;
  constructor(private service: MainService, private seo:SeoService) { }

  ngOnInit() {
    this.seo.generateTags({
      title: 'Vertex Market | OTC Digital Assets | Aftermarket', 
      description: 'Vertex Market is a secondary market OTC Trading Platform for digital assets such as Utility Tokens, Security Tokens and Stable Coins as well as for major cryptocurrencies such as Bitcoin, Ethereum, Monero and others. Vertex provides comprehensive information about ICO and other blockchain related projects.'
    })
    this.getWhitepaper();
  }


  getWhitepaper() {
    this.isLoading = true;
    this.service.getApi(`paper-link`, 0)
    .subscribe(response => {
      this.isLoading = false;
      if (response.status === 200) {
        this.whitepaper = response.body.data;
      }
    }, error => {
      this.isLoading = false;
      console.log('error')
    }); 
}
}
