import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { BookingTableService } from 'src/app/services/booking-table.service';

import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { PhoneNumberPipe } from 'src/app/pipes';
import { NotificationModalComponent, modalConfig, modalContent } from 'src/app/components/notification-modal/notification-modal.component'

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
  modalConfig = this.appConfig.getConfig().MODAL_CONFIGS;

  bookedDates = {
    closest: new Date(),
    booked: []
  }

  _errors = {
    hasError: false,
    type: '',
    message: ''
  }

  constructor(
    private fb: FormBuilder,
    private appConfig: RuntimeConfigService,
    private bookingSvc: BookingTableService,
    private phoneNumberPipe: PhoneNumberPipe,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.bookingForm = this.fb.group({
      guestInfo: this.fb.group({
        nameFirst: [this.user.fName],
        nameLast: [this.user.lName],
        email: [this.user.email],
        confirmEmail: [this.user.email],
        phoneNumber: [this.user.phoneNum],
        ageCheck: [this.user.isSignedIn ? true : false]
      }),
      tattoo: this.fb.group({
        tattooDesc: ['', [Validators.required, Validators.maxLength(300)]],
        tattooPlacement: ['', [Validators.required, Validators.maxLength(300)]],
        //bookingDate: ['', Validators.required]
      })
    })

    if(!this.user.isSignedIn){
      this.bookingForm.get('guestInfo.nameFirst').setValidators([Validators.required, Validators.maxLength(50)]);
      this.bookingForm.get('guestInfo.nameLast').setValidators([Validators.required,Validators.maxLength(50)]);
      this.bookingForm.get('guestInfo.email').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
      this.bookingForm.get('guestInfo.confirmEmail').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
      this.bookingForm.get('guestInfo.phoneNumber').setValidators([Validators.required, Validators.minLength(14)]);
      this.bookingForm.get('guestInfo.ageCheck').setValidators(Validators.requiredTrue);
    }

    // on init api calls
    
    
    this.subscriptions.add(
      this.bookingSvc.bookingUpdateResponse$.subscribe(
        res => {
          if(!res.isError){
            
            let modalData: modalConfig = {
              title: this.modalConfig.BOOKING_FORM_SUCCESS.title,
              modalSetting: modalContent.bookingSuccess,
              modalMessage: this.modalConfig.BOOKING_FORM_SUCCESS.message
            }
            this.openNotificationModal(modalData);
          }
          console.log('booking request response', res);
        }
      )
    )
    //booking form changes subscriptions
    this.onBookingFormChanges();
    
  }

  onSubmit(form){
    if(this.bookingForm.valid){

      if(this.bodyPhotos.length < 1){
        let modalData: modalConfig = {
          title: 'Required Input Error',
          modalSetting: modalContent.errorMessage,
          modalMessage: 'At least one body location photo is required'
        }
        this.openNotificationModal(modalData);
        return;
      }


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


  // bookingDateFilter = (date: Date) => {
  //   //only filters by day, needs more logic to factor in hours
    
  //   return !this.bookedDates.booked.find(x => x.getDate() == date.getDate())
  // }

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
    ).add(
      this.bookingForm.get('guestInfo.confirmEmail').valueChanges.subscribe(
        userInp => {
          if(userInp !== this.bookingForm.get('guestInfo.email').value){
            this._errors = {
              hasError: true,
              type: 'emailNotMatch',
              message: 'Emails must match'
            }
            this.bookingForm.get('guestInfo.confirmEmail').setErrors({invalid: true});
          } else {
            this._errors = {
              hasError: false,
              type: '',
              message: ''
            }
            this.bookingForm.get('guestInfo.confirmEmail').setErrors(null);
          }
          
        }
      )
    ).add(
      this.bookingForm.get('guestInfo.email').valueChanges.subscribe(
        userInp => {
          let emConf = this.bookingForm.get('guestInfo.confirmEmail');
          if(emConf.value !== '' && userInp !== emConf.value){
            this._errors = {
              hasError: true,
              type: 'emailNotMatch',
              message: 'Emails must match'
            }
            emConf.setErrors({invalid: true});
          } else {
            this._errors = {
              hasError: false,
              type: '',
              message: ''
            }
            emConf.setErrors(null);
          }
        }
      )
    )
    
  }

  timedErrorMessage(type: string, message: string){
    
    this._errors = {
      hasError: true,
      type: type,
      message: message
    }

    setTimeout(() => {
      this._errors = {
        type: '',
        hasError: false,
        message: ''
      }
    }, 3000)
  }

  openNotificationModal(modalData: modalConfig){
    let dialogRef = this.matDialog.open(NotificationModalComponent);
    let instance = dialogRef.componentInstance;
    instance.configuration = modalData;
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
