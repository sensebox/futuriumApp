import { ViewChild, Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, LoadingController, NavController } from '@ionic/angular';
import { WebServer } from '@ionic-native/web-server/ngx'
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { DataService } from '../services/data.service';
import { OsmService } from '../services/osm.service';

declare let window: any;
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
  loadingString: string = '.';
  connected: boolean = false;
  idBox:string = '601d2779e443a0001be82ec7';
  apiKey:string = 'fda3b3124b053b839930ff73fda267de82dc49e94acf4bae68904095fc76d7c9';
  idArray:Array<string> = ['lat','lng','timestamp','601d2779e443a0001be82ed6','601d2779e443a0001be82ed5','601d2779e443a0001be82ed4','601d2779e443a0001be82ed3','601d2779e443a0001be82ed3','601d2779e443a0001be82ed1','601d2779e443a0001be82ed0','601d2779e443a0001be82ecf','601d2779e443a0001be82ece','601d2779e443a0001be82ecd','601d2779e443a0001be82ecc','601d2779e443a0001be82ecb','601d2779e443a0001be82eca','601d2779e443a0001be82ec8','601d2779e443a0001be82ec9'];

  constructor(
    private router: Router,
    private webServer: WebServer,
    private data: DataService,
    private openNativeSettings: OpenNativeSettings,
    private osmController: OsmService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
  }

  initWebServer() {
    // send response
    let response;
    this.webServer.onRequest().subscribe(request => {
      if (request.path === '/activation') {
        this.connected = true;
        this.slides.lockSwipeToNext(false);
        this.slides.slideNext();
        response = {
          status: 200,
          body: 'senseBox connected',
          headers: {
            'Content-Type': 'text/html'
          }
        };
      }
      if (request.path === '/data') {
        this.handleIncRequest(request);
        const data = this.data.getMessages();
        if (data.length > 60) {
          console.log("sending to osm");
          this.data.setOSMTimestamp(data[0][2]);
          const csv = this.buildCSV();
          const token = '';
          this.osmController.postMultipleMeasurements(token, this.idBox, csv).subscribe(response => console.log(response))
        }
        response = {
          status: 200,
          body: 'Message received',
          headers: {
            'Content-Type': 'text/html'
          }
        };
      }
      this.changeDetectorRef.detectChanges();
      this.webServer.sendResponse(request.requestId, response);
    })
    this.webServer.start();
  }

  buildCSV(){
    const data = this.data.getMessages();
    // holds values
    let output='';
    let line;
    // 10 messages in total
    for (let indexOuter = 0; indexOuter < data.length; indexOuter++) {
      const elementOuter = data[indexOuter];
      for (let indexInner = 0; indexInner < elementOuter.length; indexInner++) {
        const elementInner = elementOuter[indexInner];
        if(indexInner<3) continue;
        line = this.idArray[indexInner] + ',' 
                  + elementOuter[indexInner]+ ',' 
                  + elementOuter[measurements.timestamp] + ','
                  + elementOuter[measurements.longitude] + ','
                  + elementOuter[measurements.latitude] + '\n';
        output+= line;
        line = '';                  
                }               
    }
    this.data.clearMessages();
    return output;
  }
  async handleIncRequest(request) {
    // handle message
    // split by \n and ','
    // cast to numbers instead of strings
    try {
      let messages = request.body.split('\n');
      messages = messages.map((message) => message.split(','))
      messages = messages.map((array) => {
        return array.map((string, index) => {
          if (index === measurements.timestamp) return string;
          if (index === measurements.latitude || index === measurements.longitude) return parseInt(string) / 10000000;
          if (index === measurements.pm10 || index === measurements.pm25 || index === measurements.temp || index === measurements.press) return parseInt(string) / 100;
          else return parseInt(string);
        });
      })
      messages.map(message => this.data.addMessage(message));
    } catch (error) {
      console.log(error)
    }
    console.log("Req handling done");


  }
  async onSlideChange() {
    switch (await this.slides.getActiveIndex()) {
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

  async checkLastSlide() {
    const index = await this.slides.getActiveIndex();
    if (index == 2) {
      this.goHome();
    }
  }
  startLoading() {
    const that = this;
    let interval = setInterval(function () {
      if (that.connected) {
        clearInterval(interval);
      }
      if (that.loadingString === '...') {
        that.loadingString = '.';
      }
      else {
        that.loadingString += '.';
      }
    }, 500)
  }

  // write code for ios
  openNetworkSettings() {
    if (window.cordova && window.cordova.plugins.settings) {
      console.log('openNativeSettingsTest is active');
      window.cordova.plugins.settings.open("wireless", function () {
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
  nextSlide() {
    this.slides.slideNext();
  }
  previousSlide() {
    console.log("previous slide");
    this.slides.slidePrev();
  }
  goHome() {
    //this.slide
    this.router.navigateByUrl(`/home`)
  }

}


enum measurements {
  longitude,
  latitude,
  timestamp,
  accX,
  accY,
  accZ,
  magX,
  magY,
  magZ,
  rotX,
  rotY,
  rotZ,
  distLeft,
  distRight,
  temp,
  press,
  pm25,
  pm10
}