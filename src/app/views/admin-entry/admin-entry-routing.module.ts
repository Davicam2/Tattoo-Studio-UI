import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/auth/admin.guard';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
    {
      path: '', 
      component: MainPageComponent,
      canActivate:[AdminGuard]
    }
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }