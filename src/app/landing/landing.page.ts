import { ViewChild, Component, OnInit,  } from '@angular/core';
import { Router } from '@angular/router';
import {  IonSlides, LoadingController, NavController } from '@ionic/angular';
import { WebServer } from '@ionic-native/web-server/ngx'
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { DataService } from '../services/data.service';

declare let window:any;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  loadingString:string = '.';
  connected:boolean = false;
  constructor(
    private router:Router,
    private webServer: WebServer,
    private data: DataService,
    private openNativeSettings: OpenNativeSettings
   ) {
    }

  ngOnInit() {
  }

  initWebServer(){
    // send response
    let response;
    this.webServer.onRequest().subscribe(request=>{
      console.log("inc",request);
      if(request.path === '/activation'){
        this.connected = true;
        this.slides.lockSwipeToNext(false);
        this.slides.slideNext();
        response = {
          status : 200,
          body:'senseBox connected', 
          headers:{
            'Content-Type':'text/html'
          } 
        };
      }
      if(request.path === '/data') 
      {
        this.handleIncRequest(request);
        response = {
          status : 200,
          body:'Message received',
          headers:{
            'Content-Type':'text/html'
          } 
        };
      }

      this.webServer.sendResponse(request.requestId,response);
    })
    this.webServer.start();
  }

  async handleIncRequest(request){
    console.log("Inc",request)
    console.log("Supposed Body of request", request.body)
    // handle message
    // split by \n and ','
    // cast to numbers instead of strings
    let messages = request.body.split('\n');
        messages = messages.map((message)=>message.split(','))
        messages = messages.map((array)=>{
          return array.map(string=>parseInt(string));
        })
    messages.map(message=>this.data.addMessage(message));
    console.log(messages);
    this.data.addMessage(messages);
    
  }
  async onSlideChange(){
    switch(await this.slides.getActiveIndex()){
      case 0:
        break;
      case 1:
        this.startLoading();
        this.initWebServer()
        this.slides.lockSwipeToNext(true);
        break;
      case 2:
        break
      default:
        console.warn('unknown slide, please define its logic')
    }
  }

  async checkLastSlide(){
    const index = await this.slides.getActiveIndex();
    if(index == 2){
      this.goHome();
    }
  }
  startLoading(){
    const that = this;
    let interval = setInterval(function(){
      if(that.connected){
        clearInterval(interval);
      }
        if(that.loadingString === '...')
        {
          that.loadingString = '.';
        }
        else 
        { 
          that.loadingString += '.';
        }
    },500)
  }

  // write code for ios
  openNetworkSettings()
  {
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
  nextSlide(){
    this.slides.slideNext();
  }
  previousSlide(){
    console.log("previous slide");
    this.slides.slidePrev();
  }
  goHome(){
    //this.slide
    this.router.navigateByUrl(`/home`)
  }

}
