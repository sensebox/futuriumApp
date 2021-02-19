import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { HttpClientModule } from  '@angular/common/http';
import { WebServer } from '@ionic-native/web-server/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
 
import { IonicStorageModule } from '@ionic/storage';
import { ChooseBoxComponent } from './choose-box/choose-box.component';

@NgModule({
  declarations: [AppComponent,ChooseBoxComponent],
  entryComponents: [ChooseBoxComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    WebServer,
    OpenNativeSettings,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
