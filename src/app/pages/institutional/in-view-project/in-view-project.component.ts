import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { MainService } from '../../../providers/mainService.service';

// import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
declare var $: any;
@Component({
  selector: 'app-in-view-project',
  templateUrl: './in-view-project.component.html',
  styleUrls: ['./in-view-project.component.css']
})
export class InViewProjectComponent implements OnInit {
  public isLoading:boolean = true;
  currId: any = '';
  projectDet: any = {};
  galleryData: any = [];
  // galleryOptions: NgxGalleryOptions[];
  // galleryImages: NgxGalleryImage[];

  // public config: ICarouselConfig = {
  //   verifyBeforeLoad: true,
  //   log: false,
  //   animation: true,
  //   animationType: AnimationConfig.SLIDE,
  //   autoplay: true,
  //   autoplayDelay: 2000,
  //   stopAutoplayMinWidth: 768
  // };
  constructor(private route: ActivatedRoute, private service: MainService) { 
    /* this.galleryOptions = [
      {
          breakpoint: 200,
          width: '100%',
          height: '200px',
          // imagePercent: 80,
          thumbnails: false,
          // thumbnailsPercent: 20,
          // thumbnailsMargin: 20,
          // thumbnailMargin: 20
      },
      {
        breakpoint: 200,
        width: '100%',
        height: '200px',
        // imagePercent: 80,
        thumbnails: false,
        // thumbnailsPercent: 20,
        // thumbnailsMargin: 20,
        // thumbnailMargin: 20
    },
    {
      breakpoint: 200,
      width: '100%',
      height: '200px',
      // imagePercent: 80,
      thumbnails: false,
      // thumbnailsPercent: 20,
      // thumbnailsMargin: 20,
      // thumbnailMargin: 20
  },
      
     
  ]; */
//   this.galleryImages = [
//     {
//         small: 'assets/images/about-us.png',
//         medium: 'assets/images/arrow-icon.png',
//         big: 'assets/1-big.jpg'
//     },
//     {
//         small: 'assets/images/arrow-icon.png',
//         medium: 'assets/2-medium.jpg',
//         big: 'assets/2-big.jpg'
//     },
//     {
//         small: 'assets/images/arrow-icon.png',
//         medium: 'assets/3-medium.jpg',
//         big: 'assets/3-big.jpg'
//     }
// ];
  }

  ngOnInit() {
    this.currId = this.route.snapshot.paramMap.get('id')
    this.projectDetailApi()
  }
  projectDetailApi() {
    let data = {
      project_id: this.currId
    }
    this.isLoading = true;
    this.service.postApi(`institutional-project-details`, data, 1).subscribe(response => {
      this.isLoading = false;
      if(response.status == 200) {
          this.projectDet = response.body.data
          this.galleryData = response.body.gallery_data
          // $(`#view_gallery_modal`).modal('show')
          // response.body.gallery_data.map(x => {
          //   this.galleryImages.push({
          //     small: x.image, medium: x.image, big:  x.image
          //   })
          // })
          // console.log(this.galleryImages)
          
        // this.orderDet = response.body['order-data']
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    }, error => {
      this.isLoading = false;
      if(error.status == 404) {
        this.service.toastrErr(error.error.message)
        window.history.back()
      } else {
        this.service.toastrErr(`Something went wrong`)
      }
    })
  }
  goBack() {
    window.history.back()
  }
  openWindow(link) {
    window.open(link)
  }

}
