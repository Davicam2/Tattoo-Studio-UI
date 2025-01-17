import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, CalendarApi, FullCalendarComponent } from '@fullcalendar/angular';

import * as uuid from 'uuid';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {

  @Input() events: Array<ICalendarEvent> = [];
  @Input() dynamicOptions: ICalendarOptions = {
    dateConstraints:{ 
      futureDatesOnly: false
    },
    calendarConfig:{
      month: true,
      week: false,
      day: false
    }
  };

  @Output() eventSelect = new EventEmitter<{id:string, type:string}>();
  @Output() dateSelect = new EventEmitter<{allDay: boolean, start: Date, end: Date, view: any}>();
  @Output() dateMove = new EventEmitter<{id:string, start:Date, end:Date}>();


  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  
  currentEventIds: Array<string> = [];

  calendarAPI: any;

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
    eventOverlap: false,
    longPressDelay: 300,
    eventDrop: this.handleEventDrop.bind(this)
  };

  constructor() { }

  ngOnInit(): void {
   
    
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.events){
      this.synchCalendarEventUpdates();
      console.log(this.events)
    }
    if(changes.dynamicOptions){
      this.setRestrictDatesOption();
      this.setHeaderButtons();
    }
  }

  synchCalendarEventUpdates(){

    if(this.calendarComponent){
      this.calendarAPI = this.calendarComponent.getApi();
    } else return;

    this.calendarAPI.removeAllEvents();

    if(this.events){
      this.events.forEach(
        event => {
          event['selectOverlap'] = false;
          this.calendarAPI.addEvent(event)
        }
      )
    }
  }

  setRestrictDatesOption(){
    if(this.dynamicOptions.dateConstraints.futureDatesOnly){
      this.calendarOptions.selectAllow = function(selectedDate){
        if(selectedDate.start < new Date()){
          return false;
        } else return true;
      }
    }
  }
  
  setHeaderButtons(){

    let dateGroup = '';
    const currentSettings = this.calendarOptions.headerToolbar;
    if(this.dynamicOptions.calendarConfig.month){
      dateGroup += 'dayGridMonth';
    }
    if(this.dynamicOptions.calendarConfig.week){
      dateGroup += ',timeGridWeek';
    }
    if(this.dynamicOptions.calendarConfig.day){
      dateGroup += ',timeGridDay';
    }
    this.calendarOptions.headerToolbar = {
      left: 'prev,next today',
      center: 'title',
      right: dateGroup
    }
  }

  currentEvents: EventApi[] = [];

  handleDateSelect(selectInfo: DateSelectArg) {
    this.dateSelect.emit({
      allDay: selectInfo.allDay,
      start: selectInfo.start,
      end: selectInfo.end,
      view: selectInfo.view.type
    })
  }

  
  handleEventClick(clickInfo: EventClickArg) {
    this.eventSelect.emit({id:clickInfo.event.id,type: clickInfo.event._def.extendedProps.type });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  handleEventDrop(event){
    console.log(event);
    console.log(event.event._def.publicId);
  }

  restrictDateSelections(selectedDate){
   
    if(this.dynamicOptions.dateConstraints.futureDatesOnly){
      if(selectedDate.start < new Date()){
        return false;
      }
    } else {
      return true;
    }
   
  }
}


export interface ICalendarEvent {
  start: Date,
  end: Date,
  title: string,
  allDay: boolean,
  color: string,
  id?: string,
  type?: string
}

export interface ICalendarOptions {
  dateConstraints:{
    futureDatesOnly: boolean,
  },
  calendarConfig:{
    month: boolean,
    week: boolean,
    day: boolean
  },
  longPressDelay?:  number
}