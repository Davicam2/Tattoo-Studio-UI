import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { apiResponse, IReservation } from 'src/app/interfaces';
import { RestService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {


  private serverUrl = this.appConfig.getServerUrl();
  private uris = this.appConfig.getEndpoints();


  constructor(
    private appConfig: RuntimeConfigService,
    private rApi: RestService
    ) { }


    requestAReservation(start: Date, end:Date, allDay: boolean, title:string, view?:any){
      
      this.rApi.makePostRequest(
        this.serverUrl + this.uris.requestReservedDate,
        {start:start, end:end, allDay:allDay, title: title}
        ).subscribe(
          res => {
            let response: apiResponse = {
              type: 'Post',
              origin: this.apiOrigins.requestReservation,
              isError: false,
              content: res
            } 
            return response;
          }, err =>  {
            
            return err;
          }
        )
    }


    apiOrigins = {
      requestReservation: 'requestReservation',
      
    
    }
    
}
