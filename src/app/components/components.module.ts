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

@NgModule({
  declarations: [PublicLandingComponent, BookingTableComponent, AdminLandingComponent, BookingFormComponent, ImageUploadComponent, DragDropComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    UtilModule
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