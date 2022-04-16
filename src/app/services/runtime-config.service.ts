import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig, IAppVariables } from '../interfaces/global';
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
    if(this.conf.ENVIRONMENTS.prod){
      return this.conf.URIS.BASE.express
    }else{
      return this.conf.URIS.BASE.express_dev;
    }
    
  }

  getEndpoints() {
    return this.conf.URIS.ENDPOINTS;
  }
  getEnvironment(){
    return this.conf.ENVIRONMENTS;
  }
 
  getStripeConfig(){
    return this.conf.STRIPE_SETTINGS;
  }

  getUtilitySettings(){
    return this.conf.UTILITY_SETTINGS;
  }
  

  
}
