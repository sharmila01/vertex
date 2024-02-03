import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { MainService } from './mainService.service';
declare var $: any;

@Injectable()

export class InstitutionalGuard implements CanActivateChild{
    isAccess: boolean = false;
    constructor(private service: MainService, private router: Router) {}
    async canActivateChild() {
        // console.log('canA => ', this.isAccess)
        if(localStorage.getItem(`loginToken`) != null) {
          if(this.isAccess) {
            return true;
          } else {
            let val = await this.getProfileApi()
            console.log('profile data collection => ', val)
            if(val == 1) {
              return true
            }
             else {
              // this.router.navigate(['/home'])
              $(`#userAlert`).modal(`show`);

              return false
            }
          }
        } else {
          // this.isAccess = false;
          this.router.navigate([`/vertex`,`login`])
          return false;
        }
        
    }

    getProfileApi() {
        // val = 1 for institutional pages check, val = 2 for  profile navigation
        return new Promise((resolve, reject) => {
           this.service.getApi(`profile`, 1).subscribe(response => {
              if(response.status == 200) {
                let profileData = response.body.data
                if(profileData.is_institutional) {
                  this.isAccess = true
                  resolve(1)
                } else {
                  resolve(2)
                }
              } else {
                resolve(2)
              }
            }, error => {
              resolve(2)  
            })
        })
         
      }
}