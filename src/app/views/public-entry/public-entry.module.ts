import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import {PublicRoutingModule} from './public-entry-routing.module';


@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicEntryModule { }
