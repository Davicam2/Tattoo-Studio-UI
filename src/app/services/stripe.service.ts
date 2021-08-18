import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { apiResponse } from '../interfaces';
import { RestService } from './rest-api.service';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  requestPaymentResponse$: Subject<apiResponse> = new Subject();

  constructor(
    private appConfig: RuntimeConfigService,
    private rApi: RestService
  ) { }

  requestPayment(paymentToken: any, bookingId: string){
    this.rApi.makePostRequest( this.appConfig.getServerUrl() + this.appConfig.getEndpoints().STRIPE.requestPayment,
    {paymentToken, bookingId}
    ).subscribe(
      res => {
        let response: apiResponse = {
          type: 'post',
          origin: this.appConfig.getEndpoints().STRIPE.requestPayment,
          isError: false,
          content: res
        }
        this.requestPaymentResponse$.next(response);
      }
    )
  }
}
