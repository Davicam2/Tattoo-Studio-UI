import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
    {
      path: '', 
      component: MainPageComponent
    },
    {
      path:'booking',
      component: BookingPageComponent
    }
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PublicRoutingModule { }