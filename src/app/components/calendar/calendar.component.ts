import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.dateClickAction.bind(this),
  };

  dateClickAction(arg){
    Object.keys(arg).forEach(key => {
      console.log(key +'--' + arg[key]);
      
    })
    Object.keys(arg['view']).forEach(key => {
      console.log(key +'--'+ arg['view'][key]);
    })
   
   
  }
}
