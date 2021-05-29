import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {


  constructor( private user: UserService, private router: Router){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.user.activeUser$.getValue().USER_PROFILE.isSignedIn || this.user.activeUser$.getValue().USER_PROFILE.roleID === 1){
      return true;
    } else {
      return this.router.parseUrl('/public')
    }
  }
  
}
