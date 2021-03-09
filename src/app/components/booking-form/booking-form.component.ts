import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';


@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  refPhotos: any[] = [];
  bodyPhotos: any[] = [];


  user = this.appConfig.getConfig().USER_PROFILE;
  tooltips = this.appConfig.getConfig().TOOLTIPS;
  

  bookingDates = {
    closestDate: new Date('7/15/2021'),
    bookedDates: [new Date('7/18/2021'), new Date('7/20/2021')]
  }

  constructor(
    private fb: FormBuilder,
    private appConfig: RuntimeConfigService
  ) { }

  ngOnInit(): void {
    console.log(this.bookingDates.closestDate);
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
  }

  onSubmit(){
    console.log(this.bookingForm.valid);
    console.warn(this.bookingForm.getRawValue());
  }

  onReset(){

  }

  onClear(){

  }

  bookingDateFilter = (date: Date) => {
    return !this.bookingDates.bookedDates.find(x => x.getTime() == date.getTime())
  }

  referencePhotos(uploadedPhotos){
    this.refPhotos = uploadedPhotos;
  }

  bodyPositionPhotos(uploadedPhotos){
    this.bodyPhotos = uploadedPhotos;
  }

  
}
