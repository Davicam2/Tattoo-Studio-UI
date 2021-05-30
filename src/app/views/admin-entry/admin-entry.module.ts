import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms'
import {MatDialogModule} from '@angular/material/dialog';



import {AdminRoutingModule} from './admin-entry-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { AppComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppComponentsModule,
    FormsModule,
    MatDialogModule
  ]
})
export class AdminEntryModule { }
