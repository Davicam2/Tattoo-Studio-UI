import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { ICalendarEvent, ICalendarOptions } from 'src/app/components';
import { Ibooking, IReservation } from 'src/app/interfaces';
import { BookingTableService } from 'src/app/services/booking-table.service';
import { ReservationService } from 'src/app/services/reservation.service';

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

  subscriptions = new Subscription();
  bookingConfirmationId = this.route.snapshot.paramMap.get('id');

  _calendarOptions: ICalendarOptions = {
    dateConstraints:{
      futureDatesOnly: true
    },
    calendarConfig: {
      month:true,
      week: false,
      day: false
    }
  }
  _calendarEvents: Array<ICalendarEvent> = [];
 

  constructor(
    private route: ActivatedRoute, 
    private bookingSvc: BookingTableService,
    private resSvc: ReservationService
    ) { }


  ngOnInit(): void {
    this.subscriptions.add(
      this.bookingSvc.bookings$.subscribe(
        booking => {
          console.log(booking);
        }
      )
    ).add(
      combineLatest(
        this.bookingSvc.bookings$,
        this.resSvc.reservedDateList$
      ).subscribe(
        ([bookings, resvs]) => {
          if(bookings && resvs){
            this.createCalendarEvts(bookings.content, resvs.content);
          }
        }
      )
    )

    this.bookingSvc.getBookings(null,true);
    this.resSvc.getReservationList();
  }

  calendarEventSelect(evt){

  }

  calendarDateSelect(evt){

  }




  private createCalendarEvts( bookings?: Array<Ibooking>, reservations?: Array<IReservation>){
    let tempArr: Array<ICalendarEvent> = [];

    if(bookings){
      bookings.map(
        booking => {
          if(booking.requestedDateStart.toString() !== 'tbd'){
            tempArr.push(
              {
                start: formatDate(booking.requestedDateStart, 'yyyy-MM-dd', 'en-US'),
                end: formatDate(booking.requestedDateEnd, 'yyyy-MM-dd', 'en-US'),
                allDay: booking.allDay,
                title: `Booked`,
                id: booking.id,
                groupId: 'booking',
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
              start: formatDate(res.start, 'yyyy-MM-dd', 'en-US'),
              end: formatDate(res.end, 'yyyy-MM-dd', 'en-US'),
              allDay: res.allDay,
              title: 'Booked',
              id: res.id,
              groupId: 'reservation',
              color: 'black'
            }
          )
        }
      )
    }
    this._calendarEvents = [...tempArr];
  }

}
