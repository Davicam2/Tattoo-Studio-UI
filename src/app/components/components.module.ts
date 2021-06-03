import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import {  RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../material.module';
import { UtilModule } from '../util/util.module';
import {AppPipesModule} from 'src/app/pipes/pipes.module';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { ViewHeaderComponent } from './view-header/view-header.component';
import { BookingTableInspectorComponent } from './booking-table-inspector/booking-table-inspector.component';

import { 
  BookingFormComponent, 
  PublicLandingComponent,  
  BookingTableComponent, 
  ImageUploadComponent,
  DragDropComponent
} from './index';
import { CalendarComponent } from './calendar/calendar.component';
import { FormContainerComponent } from './form-container/form-container.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';


FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin
]);


@NgModule({
  declarations: [
    PublicLandingComponent, 
    BookingTableComponent, 
    BookingFormComponent, 
    ImageUploadComponent, 
    DragDropComponent, 
    NotificationModalComponent, 
    ViewHeaderComponent, 
    BookingTableInspectorComponent, 
    CalendarComponent, 
    FormContainerComponent,

  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    UtilModule,
    AppPipesModule,
    RouterModule,
    FormsModule,
    FullCalendarModule

  ],
  exports:[
    PublicLandingComponent,
    BookingTableComponent,
    BookingFormComponent,
    ImageUploadComponent,
    ViewHeaderComponent,
    BookingTableInspectorComponent,
    CalendarComponent,
    FormContainerComponent
  ]
})
export class AppComponentsModule { }