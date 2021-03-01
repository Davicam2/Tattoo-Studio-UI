import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./views/admin-entry/admin-entry.module').then(m => m.AdminEntryModule)
  },
  {
    path: 'public',
    loadChildren: () => import('./views/public-entry/public-entry.module').then(m => m.PublicEntryModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
