import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { BookingTableService } from 'src/app/services/booking-table.service';
import { RestService } from 'src/app/services/rest-api.service';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit, OnDestroy {
  bookingForm: FormGroup;
  subscriptions = new Subscription();

  refPhotos: any[] = [];
  bodyPhotos: any[] = [];

  user = this.appConfig.getConfig().USER_PROFILE;
  tooltips = this.appConfig.getConfig().TOOLTIPS;

  bookedDates = {
    closest: new Date(),
    booked: [new Date('7/18/2021'), new Date('7/20/2021')]
  }

  constructor(
    private fb: FormBuilder,
    private appConfig: RuntimeConfigService,
    private bookingSvc: BookingTableService
  ) { }

  ngOnInit(): void {

    this.bookingForm = this.fb.group({
      guestInfo: this.fb.group({
        nameFirst: [this.user.fName],
        nameLast: [this.user.lName],
        email: [this.user.email],
        phoneNumber: [this.user.phoneNum],
        ageCheck: [this.user.isSignedIn ? true : false]
      }),
      tattoo: this.fb.group({
        tattooDesc: ['', Validators.required],
        tattooPlacement: ['', Validators.required],
        bookingDate: ['', Validators.required]
      })
    })

    if(!this.user.isSignedIn){
      this.bookingForm.get('guestInfo.nameFirst').setValidators(Validators.required);
      this.bookingForm.get('guestInfo.nameLast').setValidators(Validators.required);
      this.bookingForm.get('guestInfo.email').setValidators(Validators.required);
      this.bookingForm.get('guestInfo.phoneNumber').setValidators(Validators.required);
      this.bookingForm.get('guestInfo.ageCheck').setValidators(Validators.requiredTrue);
    }

    // on init api calls
    this.getBookedDates()
    

    this.subscriptions.add(
      this.bookingSvc.bookingUpdateResponse$.subscribe(
        res => {
          console.log('booking request response', res);
        }
      )
    ).add(
      this.bookingSvc.bookedDates$.subscribe(
        data => {
          if(!data) return;
          console.log(data);
          if(data.content.length == 0){
            this.bookedDates.closest = new Date();
            this.bookedDates.booked = [new Date()]; 
          } else {
            this.bookedDates.closest = new Date();
            this.bookedDates.booked = data.content;
          }
          console.log(this.bookedDates)
        }
      )
    )
    
    
  }

  onSubmit(form){
    this.bookingSvc.requestBooking(
      form, 
      this.bodyPhotos, 
      this.refPhotos
    )
  }

  onReset(){

  }

  onClear(){

  }

  getBookedDates(){
    this.bookingSvc.getBookedDates();
  }


  bookingDateFilter = (date: Date) => {
    //only filters by day, needs more logic to factor in hours
    
    return !this.bookedDates.booked.find(x => x.getDate() == date.getDate())
  }

  referencePhotos(uploadedPhotos){
    this.refPhotos = uploadedPhotos;
  }

  bodyPositionPhotos(uploadedPhotos){
    this.bodyPhotos = uploadedPhotos;
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
