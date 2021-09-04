import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { apiResponse, Ibooking, IBookingAcceptFm } from 'src/app/interfaces';
import { RestService } from './rest-api.service';




@Injectable({
  providedIn: 'root'
})
export class BookingTableService {

  private serverUrl = this.appConfig.getServerUrl();
  private uris = this.appConfig.getEndpoints();

  bookingUpdateResponse$: Subject<apiResponse> = new Subject();
  cancelBookingResponse$: Subject<apiResponse> = new Subject();
  updateBookingDateResponse$: Subject<apiResponse> = new Subject();

  bookedDates$: BehaviorSubject<apiResponse> = new BehaviorSubject(null)
  bookings$: BehaviorSubject<apiResponse> = new BehaviorSubject(null);

  publicUserBooking$: BehaviorSubject<apiResponse> = new BehaviorSubject(null);
  dataRestrictedBookings$: BehaviorSubject<apiResponse> = new BehaviorSubject(null);

  bookingImageLinks$: Subject<apiResponse> = new Subject()

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
      this.serverUrl + this.uris.BOOKING.requestBooking,
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
      this.serverUrl + this.uris.BOOKING.getBookedDates,
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

  getBookings(id?: string, futureOnly?: boolean){
    let body = {};

    if(id){
      body['id'] = id;
    }
    if(futureOnly){
      body['futureOnly'] = true;
    }

    this.rApi.makeGetRequest(
      this.serverUrl + this.uris.BOOKING.getBookings,
      body
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

  getSecureBookings(){
    this.rApi.makeGetRequest(this.serverUrl + this.uris.BOOKING.getSecureBookings, {}).subscribe(
      res => {
       
        let resp: apiResponse = {
            type: 'Get',
            origin: this.apiOrigins.secureBookings,
            isError: false,
            content: res 
        }
        this.dataRestrictedBookings$.next(resp);
      }, err => {

      }
    )
  }

  getBooking(id: string){
    this.rApi.makeGetRequest(
      this.serverUrl + this.uris.BOOKING.getBooking, 
      {id: id}).subscribe(
        res => {
       
          let resp: apiResponse = {
            type: 'Get',
            origin: this.apiOrigins.getBooking,
            isError: res.error,
            content: res 
          }
          this.publicUserBooking$.next(resp);
        }, err => {
          
          let resp: apiResponse ={
            type: 'Get',
            origin: this.apiOrigins.getBooking,
            isError: true,
            content: err 
          }
        }
      )
  }


  acceptBooking(id: string, form:IBookingAcceptFm){
    this.rApi.makeUpdatePutRequest(
      this.serverUrl + this.uris.BOOKING.acceptBooking,
      {id, form}
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
      this.serverUrl + this.uris.BOOKING.rejectBooking,
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

  cancelBooking(id: string){
    this.rApi.makeUpdatePutRequest(
      this.serverUrl + this.uris.BOOKING.cancelBooking,
      {id}
    ).subscribe(
      res => {
        let response: apiResponse = {
          type: 'Put',
          origin: this.apiOrigins.cancelBooking,
          isError: false,
          content: res
        }

        this.cancelBookingResponse$.next(response);
      }
    )
  }

  updateBookingDate(id: string, start: Date,end: Date){
    this.rApi.makeUpdatePutRequest(this.serverUrl + this.uris.BOOKING.reserveBookingDate,
      {id:id, start: start, end: end}
      ).subscribe(
        res => {
          let response: apiResponse = {
            type: 'update',
            origin: this.apiOrigins.updateBookingDate,
            isError: false,
            content: res
          }
          this.updateBookingDateResponse$.next(response);
          console.log('booking update res', response);
        }
      )
  }


  getBookingImageLinks(id:string){
    this.rApi.makeGetRequest(this.serverUrl + this.uris.BOOKING.getBookingImages, {id}).subscribe(
      res => {
        let response: apiResponse = {
          type: 'GET',
          origin: this.apiOrigins.imageLinks,
          isError: false,
          content: res
        }
        this.bookingImageLinks$.next(response);
      }, err => {

      }
    )
  }



  private apiOrigins = {
    acceptBooking: 'acceptBooking',
    rejectBooking: 'rejectBooking',
    getBookings: 'getPendingRequests',
    getBooking: 'getBooking',
    getBookedDates: 'getBookedDates',
    requestBooking: 'requestBooking',
    updateBookingDate: 'updateBookingDate',
    secureBookings: 'secureBookings',
    imageLinks: 'imageLinks',
    cancelBooking: 'cancelBooking'
  
  }
}