import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { apiResponse, IUserProfile } from 'src/app/interfaces';
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
    private rApi: RestService
  ) { }


    checkForUser(userName: string, pass: string){
      this.rApi.makeGetRequest(
        this.serverUrl + this.uris.checkUserLogin,
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
            }})
          }
        }, err => {
          console.log(err);
        }
      )
    }


  switchUserProfile(){
    let currentUserProf = this.activeUser$.getValue();
    if(currentUserProf.USER_PROFILE.roleID == 1){
      currentUserProf.USER_PROFILE.roleID = 2;
      this.activeUser$.next(currentUserProf)
    }else{
      currentUserProf.USER_PROFILE.roleID = 1;
      this.activeUser$.next(currentUserProf)
    }
  }


}
