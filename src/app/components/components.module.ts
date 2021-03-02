import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicLandingComponent,  BookingTableComponent, AdminLandingComponent} from './index';




@NgModule({
  declarations: [PublicLandingComponent, BookingTableComponent, AdminLandingComponent],
  imports: [
    CommonModule
    
  ],
  exports:[
    PublicLandingComponent,
    BookingTableComponent,
    AdminLandingComponent
  ]
})
export class AppComponentsModule { }