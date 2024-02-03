import { Cacheable } from 'ngx-cacheable';
import { HttpClient } from '@angular/common/http';
import { MainService } from '../providers/mainService.service';


export class AnyClass { 

    constructor(private http: HttpClient, private service: MainService){
    }


@Cacheable({
    maxAge: 7500
  })
  getBuyerToken() {
    return this.service.postApi(`want-to-buy`,0, 0)
  }


  getcurrency(){
    return this.service.getApi(`get-currency`,0)
  }
}
