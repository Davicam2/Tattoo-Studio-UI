import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RuntimeConfigService } from './services/runtime-config.service';



const appInitializerFn = (appConfig: RuntimeConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};



@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    RuntimeConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [RuntimeConfigService]
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
