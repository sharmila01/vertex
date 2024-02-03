import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MainService } from '../../../providers/mainService.service';
import * as jsPDF from "jspdf";
import * as html2canvas from 'html2canvas';


declare var  html2pdf: any
declare var $: any;
declare var kendo: any;
@Component({
  selector: 'app-in-reporting',
  templateUrl: './in-reporting.component.html',
  styleUrls: ['./in-reporting.component.css']
})
export class InReportingComponent implements OnInit {
  public isLoading:boolean = false;
  showToggle: boolean = false;
  filter: any = { search: '', currPage: 1 };
  paginationData: any = {};
  reportArr: any = [];
  offerings : any = [];
  reportData: any = [];
  currDate = new Date()
  @ViewChild('content') content: ElementRef;
  show: any;
  constructor(private service: MainService) { }

  ngOnInit() {
     this.reportApi()   
    /* this.reportData = [ 
      {
        asset: 'Polymath',
        ticker: 'POLY',
        amount_initially: 12000,
        amount_remaining: 5000,
        usd: 230,
        offering: 23,
        payment: [
          {
            id: "VTEX9897",
            amount_initially: 500,
            amount_remaining: 260,
            usd_equivalent: 260
          },
          {
            id: "VTEX32131",
            amount_initially: 1600,
            amount_remaining: 50,
            usd_equivalent: 230
          }
        ]
      },
      {
        asset: 'Vertex Promo',
        ticker: 'VTEX',
        amount_initially: 900000,
        amount_remaining: 80,
        usd: 9550,
        offering: 25,
        payment: [
          {
            id: "VTEX22222",
            amount_initially: 1500,
            amount_remaining: 222,
            usd_equivalent: 230
          },
          {
            id: "VTEX333333",
            amount_initially: 1600,
            amount_remaining: 33,
            usd_equivalent: 333
          }
        ]
      }
    ] */
  }
  // ******************   Report List Api ********************************* //
  reportApi() {
    let data = {
      page: this.filter.currPage
    }
    this.isLoading = true
    this.service.postApi(`institutional-statistics-view`, data, 1).subscribe(response => {
      console.log(response);
      this.isLoading = false;
      if(response.status == 200) {
        this.reportArr = response.body.data
        // this.offerings = this.reportArr.offerings;
        this.paginationData = response.body.pagination_data
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      this.service.toastrErr(`Something went wrong`)
    })
  }

  // ******************   End Report List Api ********************************* //

  // ******************* Pagination Functionality ***************************** // 
  changePage(page) {
    this.filter.currPage = page;
    this.reportApi()
  }
  // ******************* End Pagination Functionality ***************************** //


  openEther(txId, symbol = '') {
    this.service.openAddressPage(txId, symbol)
  }

  getAllReportApi() {
    this.isLoading = true;
    
    this.service.getApi(`download-statistics`, 1).subscribe(response => {
      // this.service.postApi(`institutional-statistics-view`, data, 1).subscribe(response => {
      this.isLoading = false
      if(response.status == 200) {
        this.reportData = response.body.data
        // $('#table_modal').modal('show')
        
        setTimeout(() => {
          // this.service.printFun('grid')
          //Running
          var element = document.getElementById('grid1'); 
          html2pdf(element);
          
           /*  html2canvas(document.getElementById('grid1')).then( ( canvas) => {
              var img = canvas.toDataURL('image/png');
              let doc = new jsPDF();
              doc.addImage(img, 'JPEG', 0, 0)
              doc.save('testt.pdf')
              $('#table_modal').modal('hide')
            })  */  

           /*  var doc = new jsPDF('p', 'pt', 'a4');
             doc.fromHTML($('#content').get(0), 15, 15, { 'width': 500 }, function (dispose) {
                doc.save('thisMotion.pdf'); 
            }); */

          
          /* let doc = new jsPDF();
          let handlers = {
            '#editor': function(element, render) {
              return true;
            }
          }

           let content = this.content.nativeElement;
           doc.fromHTML(content.innerHTML, 15, 15, {
            'width': 150,
            'elementHandlers': handlers
          })
          doc.save('test.pdf') */


          // let doc = new jsPDF();
          // doc.addHTML(document.getElementById("table_new"), function() {
          //   doc.save("obrz.pdf");
          // });
          // var draw = kendo.drawing;

          // draw.drawDOM($("#grid"), {
          //     avoidLinks: true,
          //     paperSize: "A4",
          //     margin: "2cm",
          //     scale: 0.8
          // })
          // .then(function(root) {
          //     return draw.exportPDF(root);
          // })
          // .done(function(data) {
          //     kendo.saveAs({
          //         dataURI: data,
          //         fileName: "avoid-links.pdf"
          //     });
          // });
        }, 200)
        
        // let doc = new jsPDF();
        // doc.addHTML(document.getElementById("reportPdfTable"), function() {
        // doc.save("sweepData.pdf");
        // })
        /* let data = document.getElementById('reportPdfTable').innerHTML;
        // this.service.printFun('reportPdfTable')
        html2canvas(data).then(function(canvas) {
          document.body.appendChild(canvas);
      }); */
        // html2canvas(data).then(canvas => {  
        //   // Few necessary setting options  
        //   var imgWidth = 208;   
        //   var pageHeight = 295;    
        //   var imgHeight = canvas.height * imgWidth / canvas.width;  
        //   var heightLeft = imgHeight;  
      
        //   const contentDataURL = canvas.toDataURL('image/png')  
        //   let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
        //   var position = 0;  
        //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
        //   pdf.save('MYPdf.pdf'); // Generated PDF   
        // }); 
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false
      this.service.toastrErr(`Something went wrong`)
    })
  }


  changeToggle(index: any, data: any[]) {
    data[index].expand = true;
    
}

changeToggleClose(index: any, data: any[]) {
    data[index].expand = false;
}
changeToggleAll() {
    this.reportArr.forEach(element => {
        element.expand = true;
    });
    this.showToggle = true;
}

changeToggleCloseAll() {
    this.showToggle = false;
    this.reportArr.forEach(element => {
        element.expand = false;
    });
}
  expandTable(num) {
    console.log('ticker =>> ', num);
    if(this.show == num) 
      this.show = '';
    else 
      this.show = num;
  }

}

