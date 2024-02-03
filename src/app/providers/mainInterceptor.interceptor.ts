import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from './mainService.service';
@Injectable()

export class MainInterceptor implements HttpInterceptor {
	constructor(private router: Router, private service: MainService) {}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// console.log(`intercept function`)
		
			let req = request.clone()
			//{ headers: request.headers.set('Content-Type', 'application/json') }

				// setHeaders: {
					// headers: new HttpHeaders({ "Content-Type": "application/json" }),
				// }
							
		

		return next.handle(req).do((event: HttpEvent<any>) => {
			// console.log(`do fun`)
			if(event instanceof HttpResponse) {
				// console.log('response')
				// console.log(event)
			}
		}, (err: any) => {
			if(err instanceof HttpErrorResponse) {
				// console.log('err')
				// console.log(err)
				if(err.status == 401) {
					if(localStorage.getItem(`loginToken`) != null) {
						localStorage.removeItem(`loginToken`)	
					}
					
					this.service.toastrErr(`Unauthorized`)
					this.router.navigate([`/vertex`, `login`])
				}
			}
		} )
	}
}