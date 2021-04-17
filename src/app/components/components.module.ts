import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import {  RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../material.module';
import { UtilModule } from '../util/util.module';
import {AppPipesModule} from 'src/app/pipes/pipes.module';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';

import { 
  BookingFormComponent, 
  PublicLandingComponent,  
  BookingTableComponent, 
  ImageUploadComponent,
  DragDropComponent
} from './index';

@NgModule({
  declarations: [
    PublicLandingComponent, 
    BookingTableComponent, 
    BookingFormComponent, 
    ImageUploadComponent, 
    DragDropComponent, 
    NotificationModalComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    UtilModule,
    AppPipesModule,
    RouterModule
  ],
  exports:[
    PublicLandingComponent,
    BookingTableComponent,
    BookingFormComponent,
    ImageUploadComponent,
    
  ]
})
export class AppComponentsModule { }