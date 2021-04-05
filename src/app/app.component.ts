import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {RuntimeConfigService} from './services/runtime-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Tattoo-Studio-UI';
  isDev;

  constructor(
    private _router: Router, 
    private appConfig: RuntimeConfigService
    ){}

  
  ngOnInit(){
    this.isDev = this.appConfig.getEnvironment().dev;
    

    this.appConfig.activeUser$.subscribe(
      profile => {
        if(profile.USER_PROFILE.roleID == 1){
          this._router.navigate(['admin'])
        } else {
          this._router.navigate(['public'])
        }
      }
    )
  }

  switchProfile(){
    this.appConfig.switchUserProfile();
  }

}
