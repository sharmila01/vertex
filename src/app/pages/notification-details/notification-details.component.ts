import { Component, OnInit } from '@angular/core';
import { MainService } from '../../providers/mainService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.css']
})
export class NotificationDetailsComponent implements OnInit {
  isLoggedIn: any = false;
  notifications: any[];
  unSeenCount: number;
  loader: any;

  constructor(private router: Router, private service: MainService) { }

  ngOnInit() {
    this.getNotifications();
  }

// *************Notification Section*************************
getNotifications() {
  this.notifications = [];
  this.unSeenCount = 0;
  //setInterval(() => {
    this.service.getApi(`get-notification`, 1)
    .subscribe(response => {
      if (response.status === 200) {
        this.notifications = response.body.data;
        const unSeenNotis = this.notifications.filter(x => !x.is_seen);
        this.unSeenCount = unSeenNotis.length;
        // this.
      }
    }, error => {
      console.log('error')
    });
  //}, 2000);
}

seenNotification(id) {  
  const tokenData = { 'notification_id': Number(id) }
  this.service.postApi(`seen-notification`, tokenData, 1).subscribe(response => {
    this.getNotifications();
  }, error => {
    console.log('error')
  })
}

deleteNotification(id) {
 
}
}
