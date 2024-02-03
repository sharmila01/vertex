import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  public isLoading:boolean = true;

	faqArr: any = [];
  constructor(private service: MainService) {
  	window.scrollTo(0, 0)
  }

  ngOnInit() {
    this.faqApi()
  }
  // ****************** FAQ API *************************
  faqApi() {
    // let staticData = { "title": 4 }
    this.isLoading = true;
    this.service.getApi(`faq`, 0).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.faqArr = response.body.data
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
     this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }
  // ****************** END FAQ API **********************

}
