import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, CalendarApi } from '@fullcalendar/angular';

import * as uuid from 'uuid';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {

  @Input() bookings: Array<{start: string, end: string, title: string, id: string}> = [];
  @Output() eventSelect = new EventEmitter();
  @Output() dateSelect = new EventEmitter<{allDay: boolean, start: Date, end: Date, view: any}>();

  constructor() { }

  ngOnInit(): void {
   
    
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes.bookings){
      this.calendarOptions.events = this.bookings;
      console.log(this.bookings)
      
    }
  }
  

  calendarOptions: CalendarOptions = {
    headerToolbar:{
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'today',
      month: 'month',
      week: 'week',
      day: 'day',
      
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
   
    
  };
  currentEvents: EventApi[] = [];

  handleDateSelect(selectInfo: DateSelectArg) {
    this.dateSelect.emit({
      allDay: selectInfo.allDay,
      start: selectInfo.start,
      end: selectInfo.end,
      view: selectInfo.view.type
    })

    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: uuid.v4(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }

  //TODO: use the event.id parameter to bring up the booking inspector
  handleEventClick(clickInfo: EventClickArg) {
    this.eventSelect.emit(clickInfo.event.id);
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  
 
}


