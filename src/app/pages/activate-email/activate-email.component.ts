import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../../providers/mainService.service';

declare var $: any;
@Component({
  selector: 'app-activate-email',
  templateUrl: './activate-email.component.html',
  styleUrls: ['./activate-email.component.css']
})
export class ActivateEmailComponent implements OnInit {
  public isLoading:boolean = true;
  isVerified : number = 0;
  constructor(private route: ActivatedRoute, private service: MainService) { }

  ngOnInit() {
    let params = this.route.snapshot.params;
    this.verifyEmailApi(params)

  }
  // **************  Start Verify Email API ********************** //
  verifyEmailApi(params) {
    this.isLoading = true
    this.service.postApi(`verify-email-check`, params, 0).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        this.isVerified = 1
        this.loadActivationScript()
      } else if(response.status == 202) {
        this.isVerified = 3;
        this.loadActivationScript()
      } else {
        this.isVerified = 4;
        this.loadActivationScript()
      }
    }, error => {
      this.isLoading = false
      if(error.status == 400) {
        this.isVerified = 2;
        this.loadActivationScript()
      } else {
        this.isVerified = 4;
        this.loadActivationScript()
      }
    })
  }

  loadActivationScript() {
    $('script').each(function () {
      if(this.src.includes('quantserve.com'))
        $(this).remove()
      if(this.outerHTML.includes('_qevents.push'))
      $(this.remove())
    }); 
    if(this.isVerified == 1 || this.isVerified == 4)  {
      $(`
      <script type="text/javascript">
        var _qevents = _qevents || [];
        (function() {
          var elem = document.createElement('script');
          elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
          elem.async = true;
          elem.type = "text/javascript";
          var scpt = document.getElementsByTagName('script')[0];
          scpt.parentNode.insertBefore(elem, scpt);
        })();
          _qevents.push({qacct:"p-GSZV1HE7Z21fD",labels:"_fp.event.Conversion,_fp.pcat.INSERT+PRODUCT+CATEGORY,_fp.customer.INSERT+CUSTOMER+TYPE",orderid:"INSERT+ORDER+ID",revenue:"INSERT+REVENUE",event:"refresh"});
      </script>
      `).appendTo(document.body);
    } else {
      $(`
      <script type="text/javascript">
        var _qevents = _qevents || [];
        (function() {
          var elem = document.createElement('script');
          elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
          elem.async = true;
          elem.type = "text/javascript";
          var scpt = document.getElementsByTagName('script')[0];
          scpt.parentNode.insertBefore(elem, scpt);
        })();
        _qevents.push({qacct:"p-GSZV1HE7Z21fD"});
      </script>
      `).appendTo(document.body);
    }
    
  }
  

}
