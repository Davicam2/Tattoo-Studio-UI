import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { apiResponse, Ibooking } from 'src/app/interfaces';
import { RestService } from './rest-api.service';




@Injectable({
  providedIn: 'root'
})
export class BookingTableService {

  private serverUrl = this.appConfig.getServerUrl();
  private uris = this.appConfig.getEndpoints();

  bookingUpdateResponse$: Subject<apiResponse> = new Subject();
  bookedDates$: BehaviorSubject<apiResponse> = new BehaviorSubject(null)
  bookings$: BehaviorSubject<apiResponse> = new BehaviorSubject(null);

  constructor(
    private appConfig: RuntimeConfigService,
    private rApi: RestService
    ) { }

  getTableHeaders(){
    return this.appConfig.getConfig().BOOKINGTABLE.headers;
  }
  
  requestBooking(formFields, bodyPics:Array<File>,referencePics:Array<File>){
    const bPics = new FormData();
    const rPics = new FormData();
    const submissionForm = new FormData();



    bodyPics.forEach(image => {
      submissionForm.append('bodyImgs', image);
    });
    referencePics.forEach(image => {
      submissionForm.append('refImgs', image);
    })

    // submissionForm.append('guestInfo', formFields.guestInfo);
    // submissionForm.append('tattooInfo', formFields.tattoo);
    Object.keys(formFields.guestInfo).forEach(field => {
      submissionForm.append(field, formFields.guestInfo[field]);
    })

    Object.keys(formFields.tattoo).forEach(field => {
      submissionForm.append(field, formFields.tattoo[field]);
    })
    
    
    // bPics.forEach((value,key) => {
    //   console.log(key + ' ' + value);
    // })

    const payload = {
      form: formFields,
      bodyImgs: bPics,
      refImgs: rPics
    }

    this.rApi.makePostRequest(
      this.serverUrl + this.uris.requestBooking,
      submissionForm
      ).subscribe(
        res => {
          let response: apiResponse = {
            type: 'Post',
            origin: this.apiOrigins.requestBooking,
            isError: false,
            content: res
          } 
          this.bookingUpdateResponse$.next(response);
        }, err =>  {
          
          this.bookingUpdateResponse$.next(err)
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
        console.log(res);
        res.forEach(date => {
          dates.push(new Date(date ))
        });
        let response: apiResponse = {
          type: 'Get',
          origin: this.apiOrigins.getBookedDates,
          isError: false,
          content: dates
        }
        this.bookedDates$.next(response);
      }, 
      err => {
        console.log(err);
      }
    )
  }

  getBookings(){
    
    this.rApi.makeGetRequest(
      this.serverUrl + this.uris.getBookings,
      {}
      ).subscribe(
        (res: [Ibooking]) => {
          // res.forEach(booking => {
          //   booking.submissionDate = new Date(booking.submissionDate);
          //   booking.requestedDate = new Date(booking.requestedDate);
          // });

          let response: apiResponse = {
            type: 'Get',
            origin: this.apiOrigins.getBookings,
            isError: false,
            content: res
          }
        
          this.bookings$.next(response);
          console.log(res);
        }, err => {
          console.log(err);
        }
      )
  }


  acceptBooking(id: string){
    this.rApi.makeUpdatePutRequest(
      this.serverUrl + this.uris.acceptBooking,
      {id}
    ).subscribe(
      res => {
        let response: apiResponse = {
          type: 'Put',
          origin: this.apiOrigins.acceptBooking,
          isError: false,
          content: res
        }
        console.log(response);
        this.bookingUpdateResponse$.next(response);
      }, 
      err => {
        console.log(err)
      }
    )
  }

  rejectBooking(id: string){
    this.rApi.makeDeleteRequest(
      this.serverUrl + this.uris.rejectBooking,
      {id}
    ).subscribe(
      res => {
        let response: apiResponse = {
          type: 'Delete',
          origin: this.apiOrigins.rejectBooking,
          isError: false,
          content: res
        }
        this.bookingUpdateResponse$.next(response);
        console.log('reject booking res',res)
      }, 
      err => {
        console.log(err);
      }
    )
  }

  apiOrigins = {
    acceptBooking: 'acceptBooking',
    rejectBooking: 'rejectBooking',
    getBookings: 'getPendingRequests',
    getBookedDates: 'getBookedDates',
    requestBooking: 'requestBooking'
  
  }
}