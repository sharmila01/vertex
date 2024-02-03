import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {
  public isLoading:boolean = false;
  showToggle: boolean = false;

  filter: any = { search: '', currPage: 1 };
  paginationData: any = {};
  reportArr: any = [];
  reportData: any = [];
  offerings : any = [];
  currDate = new Date()
  @ViewChild('content') content: ElementRef;
  constructor(private service: MainService) { }

  ngOnInit() {
    this.reportApi()   
  }
  // ******************   Report List Api ********************************* //
  reportApi() {
    let data = {
      page: this.filter.currPage
    }
    this.isLoading = true
    this.service.postApi(`institutional-statistics-view`, data, 1).subscribe(response => {
      console.log("institutional-statistics-view",response);
      this.isLoading = false;
      if(response.status == 200) {
        this.reportArr = response.body.data
        this.offerings = this.reportArr.offerings
        this.paginationData = response.body.pagination_data
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }



}
