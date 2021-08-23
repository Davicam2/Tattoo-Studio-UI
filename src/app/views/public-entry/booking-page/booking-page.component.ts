import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html', 
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent implements OnInit {

  headerConfig = {
    title: 'Andrew Saray Tattoos',  
    parentNav: '/public'
  }  


  constructor() { } 

  ngOnInit(): void {
  }

}
