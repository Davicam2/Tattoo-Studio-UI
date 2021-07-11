import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingTableService } from 'src/app/services/booking-table.service';

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

  constructor(private route: ActivatedRoute, private bookingSvc: BookingTableService) { }

  ngOnInit(): void {

    this.bookingSvc.bookings$.subscribe(
      booking => {
        console.log(booking);
      }
    )
    
    this.bookingSvc.getBookings(this.route.snapshot.paramMap.get('id'))
    //getBooking(this.route.snapshot.paramMap.get('id'))
  }

}
