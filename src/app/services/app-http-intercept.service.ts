import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, debounce, debounceTime, finalize, map} from 'rxjs/operators';

import { LoadingScreenService } from 'src/app/components/loading-screen/loading-screen.service';


@Injectable({
  providedIn: 'root'
})
export class AppHttpInterceptService implements HttpInterceptor {



  constructor(
    private _loading: LoadingScreenService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    
    this._loading.show();
  
    return next.handle(request)
      .pipe(
   
        finalize(() => {
        this._loading.hide();
        }
      )
    )
  
  }


}
