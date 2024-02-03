import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
	public isLoading:boolean = true;

	privacyData: any = '';
  constructor(private service: MainService, private sanitizer: DomSanitizer) {
  	window.scrollTo(0, 0)
  }

  ngOnInit() {
  	this.privacyApi()
  }
  // ***************** Privacy Policy API *************************
  privacyApi() {
		this.isLoading = true;
		// this.service.spinnerShow()
  	this.service.getApi(`privacy-policy`, 0).subscribe(response => {
  		// console.log(JSON.stringify(response))
			this.isLoading = false;
			// this.service.spinnerHide()
  		if(response.status == 200) {
  			// this.privacyData = response.body.data[0]
        this.privacyData = this.sanitizer.bypassSecurityTrustHtml(response.body.data[0].description)
  		} else {
  			this.service.toastrErr(`Something went wrong`)
  		}
  	}, error => {
  		// console.log(JSON.stringify(error))
			this.isLoading = false;
			// this.service.spinnerHide()
  		this.service.toastrErr(`Something went wrong`)
  	})
  }
  // ***************** End Privacy Policy API *********************
}
