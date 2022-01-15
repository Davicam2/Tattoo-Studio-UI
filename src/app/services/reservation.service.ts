import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { apiResponse, IReservation } from 'src/app/interfaces';
import { RestService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservationListChanged$: Subject<apiResponse> = new Subject();
  reservedDateList$: BehaviorSubject<apiResponse> = new BehaviorSubject(null)

  private serverUrl = this.appConfig.getServerUrl();
  private uris = this.appConfig.getEndpoints();


  constructor(
    private appConfig: RuntimeConfigService,
    private rApi: RestService
    ) { }


    requestAReservation(start: Date, end:Date, allDay: boolean, title:string, view?:any){
      
      console.log(start.getTime())

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
            this.reservationListChanged$.next(response);
          }, err =>  {
            let response: apiResponse = {
              type: 'Post',
              origin: this.apiOrigins.requestReservation,
              isError: true,
              content: err
            } 
            this.reservationListChanged$.next(response);
            console.log(err)
            
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

    deleteReservation(id:string){
      this.rApi.makeDeleteRequest(
        this.serverUrl + this.uris.RESERVATION.deleteReservation,
        {id:id}
      ).subscribe(
        res => {
          let response: apiResponse = {
            type: 'delete',
            origin: this.apiOrigins.deleteRes,
            isError:false,
            content: res
          }
          this.reservationListChanged$.next(response);
        }, err => {
          let response: apiResponse = {
            type: 'delete',
            origin: this.apiOrigins.deleteRes,
            isError:true,
            content: err
          }
          console.log(response);
        }
      )
    }

    

    private apiOrigins = {
      requestReservation: 'requestReservation',
      getResList: 'getReservationList',
      deleteRes: 'deleteReservation'
    
    }
    
}
