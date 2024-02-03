import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-how-works',
  templateUrl: './how-works.component.html',
  styleUrls: ['./how-works.component.css']
})
export class HowWorksComponent implements OnInit {
  public isLoading:boolean = true;
	howitsWorksData: any = {};
  constructor(private service: MainService, private sanitizer: DomSanitizer) {
  	window.scrollTo(0, 0)
  }

  ngOnInit() {
  	this.howWorksApi()
  }

  // ------------------- How Works API --------------------
  howWorksApi() {
    this.isLoading = true;
    // this.service.spinnerShow()
    this.service.getApi(`how-work`, 0).subscribe(response => {
      // console.log(JSON.stringify(response))
      this.isLoading = false;
      // this.service.spinnerHide()
      if(response.status == 200) {
        if(response.body.data.length) {
          this.howitsWorksData = response.body.data[0]
          this.howitsWorksData.description = this.sanitizer.bypassSecurityTrustHtml(this.howitsWorksData.description)
        }
        
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      // this.service.spinnerHide()
      this.service.toastrErr(`Something went wrong`)
    })
  }
  // ----------------- End How Works API ----------------------

}
