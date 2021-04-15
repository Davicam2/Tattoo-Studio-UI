import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { BookingTableService } from 'src/app/services/booking-table.service';

import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { PhoneNumberPipe } from 'src/app/pipes';

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
    booked: []
  }

  constructor(
    private fb: FormBuilder,
    private appConfig: RuntimeConfigService,
    private bookingSvc: BookingTableService,
    private phoneNumberPipe: PhoneNumberPipe
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
        tattooDesc: ['', [Validators.required, Validators.maxLength(300)]],
        tattooPlacement: ['', [Validators.required, Validators.maxLength(300)]],
        bookingDate: ['', Validators.required]
      })
    })

    if(!this.user.isSignedIn){
      this.bookingForm.get('guestInfo.nameFirst').setValidators([Validators.required, Validators.maxLength(50)]);
      this.bookingForm.get('guestInfo.nameLast').setValidators([Validators.required,Validators.maxLength(50)]);
      this.bookingForm.get('guestInfo.email').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
      this.bookingForm.get('guestInfo.phoneNumber').setValidators([Validators.required, Validators.minLength(14)]);
      this.bookingForm.get('guestInfo.ageCheck').setValidators(Validators.requiredTrue);
    }

    // on init api calls
    this.getBookedDates();
    

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
    
    
    this.onBookingFormChanges();

  }

  onSubmit(form){

    if(this.bookingForm.valid){
      this.bookingSvc.requestBooking(
        form, 
        this.bodyPhotos, 
        this.refPhotos
      )
    }else{
      // display error message
    }
    
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

  onBookingFormChanges(){
    this.subscriptions.add(
      this.bookingForm.get('guestInfo.phoneNumber').valueChanges.subscribe(
        userInp => {
          this.bookingForm.patchValue({
            guestInfo:{
              phoneNumber:this.phoneNumberPipe.transform(userInp)
            }
          }, {emitEvent: false}); 
        }
      )
    )
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
