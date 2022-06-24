import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import {  RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../material.module';
import { UtilModule } from '../util/util.module';
import {AppPipesModule} from 'src/app/pipes/pipes.module';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { 
  BookingFormComponent, 
  PublicLandingComponent,  
  BookingTableComponent, 
  ImageUploadComponent,
  DragDropComponent,
  CalendarComponent,
  FormContainerComponent,
  BookingTableInspectorComponent,
  ViewHeaderComponent,
  NotificationModalComponent,
  BookingActionModalComponent,
  StripeProcessorComponent,
  AdminSettingsComponent
} from './index';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ImageSliderModalComponent } from './image-slider-modal/image-slider-modal.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';


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
    BookingActionModalComponent, 
    StripeProcessorComponent, 
    ImageSliderModalComponent, 
    LoadingScreenComponent, 
    AdminSettingsComponent
      

  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    UtilModule,
    AppPipesModule,
    RouterModule,
    FormsModule,
    FullCalendarModule,
    CarouselModule

  ],
  exports:[
    PublicLandingComponent,
    BookingTableComponent,
    BookingFormComponent,
    ImageUploadComponent,
    ViewHeaderComponent,
    BookingTableInspectorComponent,
    CalendarComponent,
    FormContainerComponent,
    BookingActionModalComponent,
    StripeProcessorComponent,
    ImageSliderModalComponent,
    LoadingScreenComponent,
    AdminSettingsComponent
    
  ]
})
export class AppComponentsModule { }