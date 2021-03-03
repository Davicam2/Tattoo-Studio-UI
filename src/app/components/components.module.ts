import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  BookingFormComponent, 
  PublicLandingComponent,  
  BookingTableComponent, 
  AdminLandingComponent
} from './index';

import {  } from './booking-form/booking-form.component';




@NgModule({
  declarations: [PublicLandingComponent, BookingTableComponent, AdminLandingComponent, BookingFormComponent],
  imports: [
    CommonModule
    
  ],
  exports:[
    PublicLandingComponent,
    BookingTableComponent,
    AdminLandingComponent,
    BookingFormComponent
  ]
})
export class AppComponentsModule { }