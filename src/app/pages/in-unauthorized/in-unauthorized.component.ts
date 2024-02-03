import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-in-unauthorized',
  templateUrl: './in-unauthorized.component.html',
  styleUrls: ['./in-unauthorized.component.css']
})
export class InUnauthorizedComponent implements OnInit {
  isLoading;
  constructor() { }

  ngOnInit() {
    $(`#userAlert`).modal(`show`);
  }


   
}
