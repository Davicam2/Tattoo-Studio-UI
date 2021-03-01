import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from './admin-entry-routing.module';

import { MainPageComponent } from './main-page/main-page.component';



@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminEntryModule { }
