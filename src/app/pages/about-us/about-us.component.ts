import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { DomSanitizer } from '@angular/platform-browser'
import { SeoService } from '../../providers/seo.service';

declare var $: any;
@Component({
	selector: 'app-about-us',
	templateUrl: './about-us.component.html',
	styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
	vid: any;
	public isLoading: boolean = true;
	aboutData: any = '';
	teams: any;
	advisors: any;
	constructor(private service: MainService, private sanitizer: DomSanitizer,private seo:SeoService) {
		window.scrollTo(0, 0)
	}


	ngOnInit() {
		
		var self = this;
		$('.collapse').on('shown.bs.collapse', function () {
			$(this).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
		}).on('hidden.bs.collapse', function () {
			$(this).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		});
		this.aboutUsApi();
		this.getteam();
		this.getAdvisors();
	}
	// ***************** Video Play *************************** // 
	playVid() {
		this.vid.play();
	}
	// ************* End Video Play ************************** //

	// ***************** Video Pause *************************** // 
	pauseVid() {
		this.vid.pause();
	}
	// *************** End Video Pause ************************* // 

	// ***************** About Us Api ***************************
	aboutUsApi() {
		this.isLoading = true;
		this.service.getApi(`about-us`, 0).subscribe(response => {
			this.isLoading = false;
			if (response.status == 200) {
				if (response.body.data.length)
					this.aboutData = this.sanitizer.bypassSecurityTrustHtml(response.body.data[0].description)
					this.seo.generateTags({
						title: 'Vertex Market | OTC Digital Assets | Aftermarket', 
						description: "Vertex Market is a secondary market OTC Trading Platform for digital assets such as Utility Tokens, Security Tokens and Stable Coins as well as for major cryptocurrencies such as Bitcoin, Ethereum, Monero and others. Vertex provides comprehensive information about ICO and other blockchain related projects."
					  })
			} else {
				this.service.toastrErr(`Something went wrong`)
			}
		}, error => {
			this.isLoading = false;
			this.service.toastrErr(`Something went wrong`)
		})
	}
	// ***************** End About Us Api ************************

	getteam() {
		this.isLoading = true;
		this.service.getApi(`team-members`, 0).subscribe(response => {
			this.isLoading = false;
			if (response.status == 200) {
				this.teams = response.body.data;
			} else {
				this.service.toastrErr(`Something went wrong`)
			}
		}, error => {
			this.isLoading = false;
			this.service.toastrErr(`Something went wrong`)
		})
	}

	getAdvisors() {
		this.isLoading = true;
		this.service.getApi(`advisors`, 0).subscribe(response => {
			this.isLoading = false;
			if (response.status == 200) {
				this.advisors = response.body.data;
			} else {
				this.service.toastrErr(`Something went wrong`)
			}
		}, error => {
			this.isLoading = false;
			this.service.toastrErr(`Something went wrong`)
		})
	}

}
