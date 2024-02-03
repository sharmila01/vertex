import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../../providers/mainService.service';

@Component({
  selector: 'app-in-ranking',
  templateUrl: './in-ranking.component.html',
  styleUrls: ['./in-ranking.component.css']
})
export class InRankingComponent implements OnInit {
  public isLoading:boolean = false;
  ranking;
  constructor(private service: MainService) { }

  ngOnInit() {
    this.getProfileApi();
  }

  getProfileApi() {
  	this.isLoading = true;
  	this.service.getApi(`profile`, 1).subscribe(response => {
      this.isLoading = false;
      this.ranking = response.body.ranking;
  	}, error => {
      this.isLoading = false;
      if(error.status == 400) {
        this.service.toastrErr(error.error.message)
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
  		
  	})
  }
}
