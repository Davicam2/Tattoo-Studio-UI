import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  BookingFormComponent, 
  PublicLandingComponent,  
  BookingTableComponent, 
  AdminLandingComponent,
  ImageUploadComponent
} from './index';
import { AngularMaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [PublicLandingComponent, BookingTableComponent, AdminLandingComponent, BookingFormComponent, ImageUploadComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule
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