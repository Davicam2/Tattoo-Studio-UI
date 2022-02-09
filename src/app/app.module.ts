import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RuntimeConfigService } from './services/runtime-config.service';
import { AppHttpInterceptService } from './services/app-http-intercept.service';





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
    HttpClientModule,
    MatIconModule,
    MatDialogModule
    
  ],
  providers: [
    RuntimeConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [RuntimeConfigService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptService,
      multi: true
    }

  ],
  exports:[
 
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
