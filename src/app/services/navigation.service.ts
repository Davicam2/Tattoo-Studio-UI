import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router:Router) { }

  toAdmin(){
    this.router.navigateByUrl('/admin');
  }
  toPublic(){
    this.router.navigateByUrl('/public');
  }
  toBooking(){
    this.router.navigateByUrl('/public/booking');
  }
  
}
