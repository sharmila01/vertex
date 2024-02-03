import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-in-projects',
  templateUrl: './in-projects.component.html',
  styleUrls: ['./in-projects.component.css']
})
export class InProjectsComponent implements OnInit {
  public isLoading:boolean = true;
  projectArr: any = [];
  paginationData: any = {};
  filter: any = { search: '', currPage: 1 };
  currId: any = '';
  constructor(private service: MainService, private router: Router) { }

  ngOnInit() {
    this.projectListApi(1)
  }

  // ******************** Project List Api (Simple List and Search) *********************** //
  projectListApi(val) {
    let url = '';
    let data = {
      page: this.filter.currPage
    }

    if(val == 1) {
      url = `institutional-user-project`;
    } else {
      url = `institutional-project-search`;
      data['search'] = this.filter.search
    }
    this.isLoading = true;
    this.service.postApi(url, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.projectArr = response.body.data
        this.paginationData = response.body.pagination_data
      } else {
        this.service.toastrErr(`Something went wrong`)
        this.projectArr = []
        this.paginationData = {}
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
      this.projectArr = []
      this.paginationData = {}
    })
  }
  // ******************** End Project List Api (Simple List and Search) *********************** //

  // ******************** Pagination Page Change *********************** //
  changePage(page) {
    this.filter.currPage = page;
    this.filter.search ? this.projectListApi(2) : this.projectListApi(1)
  }
  // ******************** Pagination Page Change *********************** //
  onSearch() {
    // console.log('search api')
    this.filter.currPage = 1;
    this.filter.search ? this.projectListApi(2) : this.projectListApi(1)
    
  }

  // ************************* Delete Project **************************** //
  deleteModal(id) {
    console.log('delete modal => ', id)
    this.currId = id
    $('#delete_project_inst').modal({backdrop: 'static'})
  }
  onDelete() {
    // console.log('delete')
    let data = {
      project_id: this.currId
    }
    this.isLoading = true;
    this.service.postApi(`institutional-project-delete`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
        this.service.toastrSucc(response.body.message)
        
        this.filter.search ? this.projectListApi(2) : this.projectListApi(1)
        
      } else {
        this.service.toastrErr('Something went wrong')
      }
      $('#delete_project_inst').modal('hide')
    }, error => {
      this.isLoading = false;
      $('#delete_project_inst').modal('hide')
      if(error.status == 404)
        this.service.toastrErr(error.error.message)
      else 
        this.service.toastrErr('Something went wrong')
    })

  }
  // ************************* End Delete Project ************************ //

  editProject(item) {
    if(item.is_approved) {
      this.service.toastrErr(`This project is approved. So you can't edit it.`)
    } else {
      this.router.navigate(['/institutional/add-project', item.id])
    }

  }

}
