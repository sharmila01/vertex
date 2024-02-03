import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
	public isLoading:boolean = true;

	termsData: any = '';
  constructor(private service: MainService, private sanitizer: DomSanitizer) {
		window.scrollTo(0, 0)
  }

  ngOnInit() {
  	this.termsApi()
  }
  // ******************  Terms & Condition API ***************************
  termsApi() {
		this.isLoading = true;
  	this.service.getApi(`terms-services`, 0).subscribe(response => {
			this.isLoading = false;
  		if(response.status == 200) {
        this.termsData = this.sanitizer.bypassSecurityTrustHtml(response.body.data[0].description)
  		} else {
  			this.service.toastrErr(`Something went wrong`)
  		}
  	}, error => {
  		console.log(error)
			this.isLoading = false;
  		this.service.toastrErr(`Something went wrong`)
  	})
  }
  // ******************  End Terms & Condition API ***************************

}
