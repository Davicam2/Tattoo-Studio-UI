import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import {PublicRoutingModule} from './public-entry-routing.module';
import { AppComponentsModule } from 'src/app/components/components.module';
import { BookingPageComponent } from './booking-page/booking-page.component';


@NgModule({
  declarations: [MainPageComponent, BookingPageComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    AppComponentsModule
  ]
})
export class PublicEntryModule { }
