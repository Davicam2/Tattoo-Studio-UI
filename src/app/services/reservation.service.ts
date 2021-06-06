import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { apiResponse, IReservation } from 'src/app/interfaces';
import { RestService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservationCreated$: Subject<apiResponse> = new Subject();
  reservedDateList$: BehaviorSubject<apiResponse> = new BehaviorSubject(null)

  private serverUrl = this.appConfig.getServerUrl();
  private uris = this.appConfig.getEndpoints();


  constructor(
    private appConfig: RuntimeConfigService,
    private rApi: RestService
    ) { }


    requestAReservation(start: Date, end:Date, allDay: boolean, title:string, view?:any){
      
      this.rApi.makePostRequest(
        this.serverUrl + this.uris.RESERVATION.requestReservedDate,
        {start:start, end:end, allDay:allDay, title: title}
        ).subscribe(
          res => {
            let response: apiResponse = {
              type: 'Post',
              origin: this.apiOrigins.requestReservation,
              isError: false,
              content: res
            } 
            this.reservationCreated$.next(response);
          }, err =>  {
            this.reservationCreated$.next(err);
          }
        )
    }

    getReservationList(){
      this.rApi.makeGetRequest(
        this.serverUrl + this.uris.RESERVATION.getReservationList,
        {}).subscribe(
          res => {
            let response: apiResponse = {
              type: 'Get',
              origin: this.apiOrigins.getResList,
              isError: false,
              content: res
            }
            this.reservedDateList$.next(response);
          }, err => {
            let response: apiResponse = {
              type: 'Get',
              origin: this.apiOrigins.getResList,
              isError: true,
              content: err
            }
            this.reservedDateList$.next(response);
          }

        )
    }


    private apiOrigins = {
      requestReservation: 'requestReservation',
      getResList: 'getReservationList'
    
    }
    
}
