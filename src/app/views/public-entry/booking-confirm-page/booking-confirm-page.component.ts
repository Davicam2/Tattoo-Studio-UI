import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { ICalendarEvent, 
  ICalendarOptions, 
  modalConfig, 
  NotificationModalComponent, 
  modalContent, 
  stripePurchaseDetails } from 'src/app/components';
import { Ibooking, IReservation } from 'src/app/interfaces';
import { BookingTableService } from 'src/app/services/booking-table.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-booking-confirm-page',
  templateUrl: './booking-confirm-page.component.html',
  styleUrls: ['./booking-confirm-page.component.scss']
})
export class BookingConfirmPageComponent implements OnInit {

  headerConfig = {
    title: 'Andrew Saray Tattoos',
    parentNav: '/public'
  }

  pageConfig ={
    showCalendar: true,
    showPaymentProcessor: false,
    showUpdateDateButton: false
  }

  subscriptions = new Subscription();
  bookingConfirmationId = this.route.snapshot.paramMap.get('id');
  userBooking: Ibooking;
  userDateSelection: {start: Date, end:Date};

  stripeBookingDetails: stripePurchaseDetails = {
    amount: null,
    bookedDate: null,
    amountType: null
  }

  _calendarOptions: ICalendarOptions = {
    dateConstraints:{
      futureDatesOnly: true
    },
    calendarConfig: {
      month:true,
      week: false,
      day: false,
      
    },
    longPressDelay: .5
  }

  _calendarEvents: Array<ICalendarEvent> = [];
 

  constructor(
    private route: ActivatedRoute, 
    private bookingSvc: BookingTableService,
    private resSvc: ReservationService,
    private stripeService: StripeService,
    private matDialog: MatDialog,
    private router: Router
  ) { }


  ngOnInit(): void {
    debugger
    this.subscriptions.add(
      combineLatest(
        this.bookingSvc.dataRestrictedBookings$,
        this.resSvc.reservedDateList$
      ).subscribe(
        ([bookings, resvs]) => {
          if(bookings && resvs){
            this.createCalendarEvts(bookings.content, resvs.content);
          }
        }
      )
    ).add(
      this.stripeService.requestPaymentResponse$.subscribe(
        res => {
          
          console.log(res);
          //alert('payment request Recieved');
          let dialogRef = this.matDialog.open(NotificationModalComponent);
          let instance = dialogRef.componentInstance;
          let modalData: modalConfig = {
            title: 'Payment Confirmation',
            modalSetting: modalContent.paymentResponse,
            modalMessage: 'Payment Recieved',
            contentBody: res
          }
          instance.configuration = modalData;
          dialogRef.afterClosed().subscribe(
            res => {
              this.router.navigate(['public/faq']);
            }
          )

          if(!res.isError){
            this.bookingSvc.updateBookingDate(this.bookingConfirmationId,this.userDateSelection.start, this.userDateSelection.end);
          }
        }
      )
    ).add(
      this.bookingSvc.publicUserBooking$.subscribe(
        res => {
          if(!res) return;
          if(res.isError){
            //TODO:
            //show error modal for info purposes, on modal close navigate away
            this.router.navigate(['public']);
          }
          console.log(res);
          this.userBooking = res.content;
          this.stripeBookingDetails.amount = this.userBooking.depositAmount;
          this.stripeBookingDetails.amountType = "Deposit Amount";

          this.pageConfig.showPaymentProcessor = !this.userBooking.depositPaid;
          this.pageConfig.showUpdateDateButton = !this.pageConfig.showPaymentProcessor;
          //if(this.userBooking.depositPaid && this.userBooking.status == 'accepted')
          
        }
      ).add(
        this.bookingSvc.updateBookingDateResponse$.subscribe(
          res => {
            if(this.pageConfig.showPaymentProcessor) return;

            let dialogRef = this.matDialog.open(NotificationModalComponent);
            let instance = dialogRef.componentInstance;
            let modalData: modalConfig = {
              title: 'Booking Date Updated',
              modalSetting: modalContent.bookingSuccess,
              modalMessage: `Your Booking has been moved to ${formatDate( this.userDateSelection.start,'dd/MM/yyyy','en-US' )}` ,
              contentBody: res
            }
            instance.configuration = modalData;
            dialogRef.afterClosed().subscribe(
              res => {
                this.router.navigate(['public/faq']);
              }
            )

          }
        )
      )
    )

    this.bookingSvc.getSecureBookings();
    this.bookingSvc.getBooking(this.bookingConfirmationId);
    this.resSvc.getReservationList();
  }

  calendarEventSelect(evt){
    if(evt.id == this.userBooking.id){
      this._calendarEvents = this._calendarEvents.filter(x => x.id != evt.id);
      this.userDateSelection = null;
      this.stripeBookingDetails.bookedDate = null;
    }
  }

  calendarDateSelect(evt){
    console.log(evt);
    const futureEvents = this._calendarEvents.filter(evt => new Date(evt.end) > new Date())
    let count = 0;
    if(this.userDateSelection) return;

    evt.start.setHours(1,0,0);
    let st = Date.parse(evt.start);
    evt.end.setHours(-5,0,0);
    let ed = Date.parse(evt.end);
    let halfDayEvt;

    for(let calendarEvent of futureEvents){
      if(
        st >= Number(calendarEvent.start) && st <= Number(calendarEvent.end) ||
        ed >= Number(calendarEvent.start) && ed <= Number(calendarEvent.end) ||
        Number(calendarEvent.start) >= st && Number(calendarEvent.start) <= ed ||
        Number(calendarEvent.end) >= st && Number(calendarEvent.end) <= ed
      ){
        if(calendarEvent.allDay){

          let dialogRef = this.matDialog.open(NotificationModalComponent);
          let instance = dialogRef.componentInstance;
          let modalData: modalConfig = {
            title: 'Date Selection Error',
            modalSetting: modalContent.errorMessage,
            modalMessage: 'Day fully booked, please select a different date',
          }
          instance.configuration = modalData;
          console.log('all day event, day closed for bookings')

          return;
        } else {
          halfDayEvt = calendarEvent;
          count += 1;
        }
      }
    }

    if(count  > 1){
   

      console.log('ive picked a date with two events');
      return; 
    } else if(count == 1 && this.userBooking.allDay){
      console.log('User booking requires full day');

      let dialogRef = this.matDialog.open(NotificationModalComponent);
          let instance = dialogRef.componentInstance;
          let modalData: modalConfig = {
            title: 'Date Selection Error',
            modalSetting: modalContent.errorMessage,
            modalMessage: 'Your booking requires a full day, please select a different date',
          }
          instance.configuration = modalData;

      return;
    } else if(count == 1 && !this.userBooking.allDay){
      if(new Date(halfDayEvt.start).getHours() < 12){
        this.generateCalendarEvent(evt,'PM Booking', 'blue','pm');
      } else{
        this.generateCalendarEvent(evt, 'AM Booking', 'blue','am');
      }
      return;
    }
   
    let userTimeSelect = '';
    if(this.userBooking.allDay){
      this.generateCalendarEvent(evt, 'All Day Booking', 'blue', 'allDay');
    }else{
      let dialogRef = this.matDialog.open(NotificationModalComponent);
      let modalData: modalConfig = {
        title: 'Time Slot Selection',
        modalSetting: modalContent.timeslotSelect,
        modalMessage: 'Please select a timeslot for your appointment.',
        contentBody: {event: evt, booking: this.userBooking}
      }
      dialogRef.componentInstance.configuration = modalData;
      
      dialogRef.afterClosed().subscribe(
        timeSlot => {
          if(!timeSlot) return;
          userTimeSelect = timeSlot;
          this.generateCalendarEvent(evt, 'user booking', 'blue', userTimeSelect);
        }
      )
    }
  }

  generateCalendarEvent(evt: any, title: string, color: string, timeslot){
  
    
    if(timeslot == 'am'){
      evt.start.setHours(8,0,0);
      evt.end.setHours(12,0,0);

    }else if(timeslot == 'pm'){
      evt.start.setHours(13,0,0);
      evt.end.setHours(17,0,0);
    }
    this.userDateSelection = {start: evt.start, end: evt.end};
    this.stripeBookingDetails.bookedDate = evt.start;
    let temp: ICalendarEvent = {
      start: evt.start,
      end: evt.end,
      allDay: this.userBooking.allDay,
      title: title,
      id: this.userBooking.id,
      color: color
    }

    this._calendarEvents = [...this._calendarEvents,temp ];
  }

  submitPaymentRequest(token){
    // check for date selection
    
    if(this.userDateSelection){
      this.stripeService.requestPayment(token, this.bookingConfirmationId, "deposit");
    }
    
  }

  updateBookingDate(){
    this.bookingSvc.updateBookingDate(this.bookingConfirmationId,this.userDateSelection.start, this.userDateSelection.end);
  }       




  private createCalendarEvts( bookings?: Array<Ibooking>, reservations?: Array<IReservation>){
    let tempArr: Array<ICalendarEvent> = [];

    if(bookings){
      bookings.map(
        booking => {
          if(booking.startDate.toString() !== 'tbd' && booking.status === 'booked'){
            tempArr.push(
              {
                start: booking.startDate,
                end: booking.endDate,
                allDay: booking.allDay,
                title: `Booked`,
                color: 'black',
              }
            )
          }
        }
      )
    }
    if (reservations){
      reservations.map(
        res => {
          tempArr.push(
            {
              start: res.start,
              end: res.end,
              allDay: res.allDay,
              title: 'Booked',
              color: 'black'
            }
          )
        }
      )
    }
    this._calendarEvents = [...tempArr];
  }

}
