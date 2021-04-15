import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  BookingFormComponent, 
  PublicLandingComponent,  
  BookingTableComponent, 
  AdminLandingComponent,
  ImageUploadComponent,
  DragDropComponent
} from './index';
import { AngularMaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms'
import { UtilModule } from '../util/util.module';
import {AppPipesModule} from 'src/app/pipes/pipes.module';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';

@NgModule({
  declarations: [PublicLandingComponent, BookingTableComponent, AdminLandingComponent, BookingFormComponent, ImageUploadComponent, DragDropComponent, NotificationModalComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    UtilModule,
    AppPipesModule
  ],
  exports:[
    PublicLandingComponent,
    BookingTableComponent,
    AdminLandingComponent,
    BookingFormComponent,
    ImageUploadComponent,
    
  ]
})
export class AppComponentsModule { }