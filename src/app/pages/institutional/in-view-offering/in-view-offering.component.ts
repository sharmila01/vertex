import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../../providers/mainService.service';

@Component({
  selector: 'app-in-view-offering',
  templateUrl: './in-view-offering.component.html',
  styleUrls: ['./in-view-offering.component.css']
})
export class InViewOfferingComponent implements OnInit {
  public isLoading:boolean = true;
  currId: any = '';
  offDet: any = {}
  projectList: any = [];
  // symbolArr: any  = [];
  constructor(private route: ActivatedRoute, private service: MainService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      console.log(params['id'])
      this.currId = params['id']
      // await this.getPlatformApi()
      await this.getProjectApi()
      this.offeringDetailApi()
    })
  }
  offeringDetailApi() {
    let data = {
      offering_id: this.currId
    }
    this.isLoading = true;
    this.service.postApi(`institutional-details`, data, 1).subscribe(response => {
      console.log('response',response);
      this.isLoading = false;
      if(response.status = 200) {
        if(response.body.data.length) {
          if(response.body.data.length) {
            this.offDet = response.body.data[0]
            // this.projectList.filter(x => x.id == this.offDet.project)
            let arr = this.projectList.filter(x =>  x.id == this.offDet.project )
            if(arr.length)
              this.offDet.projectName = arr[0].token_name
          }
          
        }
          
      } else {

      }
    }, error => {
      this.isLoading = false;
    })
  }

  getProjectApi() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.service.getApi(`institutional-project`, 1).subscribe(response => {
        this.isLoading = false;
        console.log(response)
        if(response.status == 200) {
          this.projectList = response.body.data
          
          resolve(true)
        }
      }, error => {
        this.isLoading = false;
        this.service.toastrErr(`Something went wrong`)
      })
    })
    
  }

  goBack() {
    window.history.back()
  }
  onEdit(item) {
    if(!item.is_approved) {
      this.router.navigate(['/institutional/add-offering', item.id])
    } else 
      this.service.toastrErr(`Approved offering can not be edited`)
  }
  openAddress(txId, symbol = '') {
    // window.open(`https://ropsten.etherscan.io/address/${txId}`)
    this.service.openAddressPage(txId, symbol)
  }
  /* getPlatformApi() {
    return new Promise((resolve, reject) => {
      this.service.spinnerShow()
      this.service.getApi(`get-platform`, 1).subscribe(response => {
        this.service.spinnerHide()
        if(response.status == 200) {
          this.symbolArr = response.body.data
          resolve(true)
        } else {
          this.service.toastrErr(`Something went wrong`)
        }
      }, error => {
        this.service.spinnerHide()
        this.service.toastrErr(`Something went wrong`)
      })
    })
  }
  getSymbol(symbol) {
    let arr =  this.symbolArr.filter(x => x['id'] == symbol)
    return arr.length?  arr[0].acceptable_token_symbol : ''
  } */

}
