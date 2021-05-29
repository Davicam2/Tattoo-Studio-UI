import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminGuard } from 'src/app/auth/admin.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./views/admin-entry/admin-entry.module').then(m => m.AdminEntryModule),
    canActivate:[AdminGuard]
  },
  {
    path: 'public',
    loadChildren: () => import('./views/public-entry/public-entry.module').then(m => m.PublicEntryModule)
  },
  
  {
    path:'**',
    pathMatch:'full',
    redirectTo: 'public'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
