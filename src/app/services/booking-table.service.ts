import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { apiResponse } from 'src/app/interfaces';
import { RestService } from './rest-api.service';



@Injectable({
  providedIn: 'root'
})
export class BookingTableService {

  private serverUrl = this.appConfig.getServerUrl();
  private uris = this.appConfig.getEndpoints();

  bookingReqResp$: Subject<apiResponse> = new Subject();
  bookedDates$: BehaviorSubject<apiResponse> = new BehaviorSubject(null)

  constructor(
    private appConfig: RuntimeConfigService,
    private rApi: RestService
    ) { }

  getTableHeaders(){
    return this.appConfig.getConfig().BOOKINGTABLE.headers;
  }
  
  requestBooking(formFields, bodyPics:any,referencePics:any): any{

    const payload = {
      form: formFields,
      bodyImgs: bodyPics,
      tatImgs: referencePics
    }
   
    this.rApi.makePostRequest(
      this.serverUrl + this.uris.requestBooking,
      payload
      ).subscribe(
        res => {
      
          this.bookingReqResp$.next(res);
        }, err =>  {
        
          this.bookingReqResp$.next(err)
        }
      )
  }

  getBookedDates(){
    this.rApi.makeGetRequest(
      this.serverUrl + this.uris.getBookedDates,
      ''
    ).subscribe(
      res => {
        let dates = [];
        res.forEach(date => {
          dates.push(new Date(date))
        });
        let response: apiResponse = {
          type: 'Get Request',
          origin: 'getBookedDates',
          isError: false,
          content: dates
        }
        this.bookedDates$.next(response);
      }, 
      err => {

      }
    )
  }

}