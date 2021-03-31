import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { RestService } from './rest-api.service';


@Injectable({
  providedIn: 'root'
})
export class BookingTableService {

  private serverUrl = this.appConfig.getServerUrl();
  private uris = this.appConfig.getEndpoints();

  bookingReqResp$: Subject<any> = new Subject();

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
      this.serverUrl + this.uris.postBooking,
      payload
      ).subscribe(
        res => {
          return res;
        }
      )
  }

}