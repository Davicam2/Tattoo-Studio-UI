import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from './admin-entry-routing.module';
import {FormsModule} from '@angular/forms'

import { MainPageComponent } from './main-page/main-page.component';
import { AppComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppComponentsModule,
    FormsModule
  ]
})
export class AdminEntryModule { }
