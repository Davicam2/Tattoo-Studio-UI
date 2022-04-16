import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import {catchError, debounce, debounceTime, finalize, map, timeout} from 'rxjs/operators';

import { LoadingScreenService } from 'src/app/components/loading-screen/loading-screen.service';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service'


@Injectable({
  providedIn: 'root'
})
export class AppHttpInterceptService implements HttpInterceptor {



  constructor(
    private _loading: LoadingScreenService,
    private _util: RuntimeConfigService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    
    this._loading.show();
    
    return next.handle(request)
      .pipe(
        timeout(15000),
        catchError((error) => {
          
            if (error instanceof TimeoutError) {
              //TODO: this error isnt handled well right now, ends up not passing back a stream, need to figure out how to throw the correct type of error or handle this one
              return throwError({ error: 'Timeout Exception'})
            }
          }
        ),
        finalize(() => {
        this._loading.hide();
        }
      )
    )
  
  }


}
