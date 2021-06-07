import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject} from 'rxjs';
import { RestService } from './rest-api.service';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class BookingPageService {

  bookedDates$: Subject<any> = new Subject();

  constructor(
    private rAPISvc:RestService,
    private configSvc:RuntimeConfigService
  ) { }

  getNeoResponse(){
    
    this.rAPISvc.makeGetRequest(
      this.configSvc.getConfig().URIS.BASE.express +
      this.configSvc.getConfig().URIS.ENDPOINTS.BOOKING.getBookedDates,
      ""
    ).subscribe(
      (data) => {
        this.bookedDates$.next(data);
      }, 
      (err) => {
        console.error(err);
      }
    )
  }
}
