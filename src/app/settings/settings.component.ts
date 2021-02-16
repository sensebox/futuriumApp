import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { Router, } from '@angular/router';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import {DisclaimerComponent} from '../disclaimer/disclaimer.component'
declare let window:any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  private language: string = 'en'
  constructor(
    public popoverController: PopoverController,
    public router: Router,
    public navParams: NavParams,
    private openNativeSettings: OpenNativeSettings,
  ) {

  }


  showInfo(){
  }

  showNetwork(){
    if (window.cordova && window.cordova.plugins.settings) {
      console.log('openNativeSettingsTest is active');
      window.cordova.plugins.settings.open("wireless", function() {
              console.log('opened settings');
          },
          function () {
              console.log('failed to open settings');
          }
      );
  } else {
      console.log('openNativeSettingsTest is not active!');
  }
  }

  ngOnInit() { }

}
