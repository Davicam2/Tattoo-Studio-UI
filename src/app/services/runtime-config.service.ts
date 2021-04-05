import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig, IUserProfile } from '../interfaces/global';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class RuntimeConfigService {
  private conf: IAppConfig;
  activeUser$:BehaviorSubject<IUserProfile> = new BehaviorSubject(null)

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get('/assets/app.config.json')
      .toPromise()
      .then(data => {
        
        this.conf = data as IAppConfig;
        
        this.activeUser$.next({USER_PROFILE: this.conf.USER_PROFILE})
        
      })
  }

  getConfig(): IAppConfig {
    return this.conf;
  }
  
  getServerUrl() {
    return this.conf.URIS.BASE.express;
  }

  getEndpoints() {
    return this.conf.URIS.ENDPOINTS;
  }
  getEnvironment(){
    return this.conf.ENVIRONMENTS;
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
