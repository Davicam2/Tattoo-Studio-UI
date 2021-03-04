import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../interfaces/global';


@Injectable({
  providedIn: 'root'
})

export class RuntimeConfigService {
  private conf: appConfig;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get('/assets/app.config.json')
      .toPromise()
      .then(data => {
        this.conf = data as appConfig;
      })
  }

  getConfig(): appConfig {
    return this.conf;
  }
}
