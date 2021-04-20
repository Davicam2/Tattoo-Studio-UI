import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig, IUserProfile } from '../interfaces/global';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class RuntimeConfigService {
  private conf: IAppConfig;

  constructor(
    private http: HttpClient
    ) { }

  loadAppConfig() {
    return this.http.get('/assets/app.config.json')
      .toPromise()
      .then(data => {
        this.conf = data as IAppConfig;
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
 
  

  
}
