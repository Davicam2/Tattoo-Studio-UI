import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { BehaviorSubject, Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { apiResponse, IUserProfile } from 'src/app/interfaces';
import { NavigationService } from './navigation.service';
import { RestService } from './rest-api.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private serverUrl = this.appConfig.getServerUrl();
  private uris = this.appConfig.getEndpoints();



  activeUser$:BehaviorSubject<IUserProfile> = new BehaviorSubject({USER_PROFILE: this.appConfig.getConfig().USER_PROFILE});



  constructor(
    private appConfig:RuntimeConfigService,
    private rApi: RestService,
    private nav: NavigationService,
    private router: Router
  ) { }


    checkForUser(userName: string, pass: string){
      this.rApi.makeGetRequest(
        this.serverUrl + this.uris.USER.checkUserLogin,
        {userName: userName, pass:pass}
      ).subscribe(
        res => {
          console.log(res);
          if(res){
            this.activeUser$.next({USER_PROFILE: {
              fName: res.firstName,
              lName: res.lastName,
              ID: res.id,
              email: res.email,
              phoneNum: res.phoneNumber,
              role: res.role,
              roleID: res.roleID,
              userName: res.userName,
              isSignedIn: true
            }});

            if(res.roleID === 1){
              this.nav.toAdmin();
            }

          }
        }, err => {
          console.log(err);
        }
      )
    }


  switchUserProfile(){
    if(this.router.url.includes('public')){
      this.nav.toAdmin();
    } else {
      this.nav.toPublic();
    }
  }


}
