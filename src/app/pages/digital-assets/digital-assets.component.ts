import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-digital-assets',
  templateUrl: './digital-assets.component.html',
  styleUrls: ['./digital-assets.component.css']
})
export class DigitalAssetsComponent implements OnInit {
  public isLoading:boolean = false;
  urlArr: any = [];
  currHtml: any = {};
  constructor(private service: MainService, private metaService: Meta, private titleService: Title, private router: Router) { }

  ngOnInit() {
    this.getWebpagesApi()
  }

  getWebpagesApi() {
    this.isLoading = true;
    this.service.getApi(`get-webpages`, 0).subscribe(response => {
      this.isLoading = false;
      this.urlArr = response.body.data;
      let currUrl = location.pathname.split('/')[2]
      let currArr = []
      if(this.urlArr) {
        this.currHtml = this.urlArr.filter(x => x.page_url == currUrl)[0]
        if(this.currHtml) {
          this.titleService.setTitle(`Vertex Market - ${this.currHtml.meta_title}` )
          this.metaService.addTag({ name: 'description', content: this.currHtml.meta_text });
        } else {
          this.router.navigate(['/home'])
        }
        
      } else {
        this.router.navigate(['/home'])
      }
      console.log(this.currHtml)
      
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`);
    })
  }

}
