import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { BookingConfirmPageComponent } from './booking-confirm-page/booking-confirm-page.component';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
    {
      path: '', 
      component: MainPageComponent
    },
    {
      path:'booking',
      component: BookingPageComponent
    },
    {
      path: 'about',
      component: AboutPageComponent
    },
    {
      path: 'faq',
      component: FaqPageComponent
    },
    {
      path: 'confirm/:id',
      component: BookingConfirmPageComponent
    }

   
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PublicRoutingModule { }