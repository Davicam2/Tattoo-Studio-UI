import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor( private http: HttpClient) { }

  makeGetRequest (url: string, payload: any){
    return this.http.get<any>(url,{params: payload}).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return (error || 'Server Error')
      })
    );
  }

  makePostRequest (url: string, payload: any){
   
    return this.http.post<any>(url,payload).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return (error || 'Server Error')
      })
    );
  }
  
  makeDeleteRequest (url: string, payload: any){

    return this.http.delete<any>(url,{ params: payload}).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return (error || 'Server Error')
      })
    );
  }

  makeUpdatePutRequest (url: string, payload: any){

    return this.http.put<any>(url,payload).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return (error || 'Server Error')
      })
    );
  }
}