import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { BookingTableService } from 'src/app/services/booking-table.service';
import { RestService } from 'src/app/services/rest-api.service';
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
    private appConfig: RuntimeConfigService,
    private bookingSvc: BookingTableService,
    private apiSvc: RestService
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

    console.log(this.appConfig.getServerUrl())
    
  }

  onSubmit(form){
    console.log(this.bookingForm.valid);
    console.warn(form, this.refPhotos, this.bodyPhotos);
    this.bookingSvc.requestBooking(
      form, 
      this.bodyPhotos, 
      this.refPhotos
      ).subscribe( 
        res => {
          console.log(res);
        }
      )
    
    //this.bookingSvc.requestBooking(form,this.bodyPhotos, this.refPhotos)
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
