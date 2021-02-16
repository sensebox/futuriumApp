import { AfterViewInit,ChangeDetectorRef, Component } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { ModalController, PopoverController, ToastController } from '@ionic/angular';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import {SettingsComponent} from '../settings/settings.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  elements: Array<any> = [];

  public status:boolean = false;
  interval: any;
  measuring: Boolean = false;
  idBox:string = '601d2779e443a0001be82ec7';
  apiKey:string = 'fda3b3124b053b839930ff73fda267de82dc49e94acf4bae68904095fc76d7c9';
  idArray:Array<string> = ['lat','lng','timestamp','601d2779e443a0001be82ed6','601d2779e443a0001be82ed5','601d2779e443a0001be82ed4','601d2779e443a0001be82ed3','601d2779e443a0001be82ed3','601d2779e443a0001be82ed1','601d2779e443a0001be82ed0','601d2779e443a0001be82ecf','601d2779e443a0001be82ece','601d2779e443a0001be82ecd','601d2779e443a0001be82ecc','601d2779e443a0001be82ecb','601d2779e443a0001be82eca','601d2779e443a0001be82ec8','601d2779e443a0001be82ec9'];
  loadingString:string = '.';
  messages:any; 
  lastTimestamp:string;
  lastOSMTimestamp:string;

  constructor(
    private data: DataService,
    public toastController: ToastController,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

      
  }
  ngAfterViewInit(){
    this.startLoading();

  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  async presentSettings(ev: any) {
    const popover = await this.popoverController.create({
      component: SettingsComponent,
      event: ev,
      translucent: true
    })

    return await popover.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DisclaimerComponent,
      cssClass: 'my-custom-class'
    });

    return await modal.present();
  }

  startLoading(){
    const that = this;
    let interval = setInterval(function(){
        if(that.loadingString === '...')
        {
          that.loadingString = '.';
        }
        else 
        { 
          that.loadingString += '.';
        }
        that.lastTimestamp = that.data.getTimestamp();
        that.lastOSMTimestamp = that.data.getOSMTimestamp();
        that.changeDetectorRef.detectChanges();
    },500)
  }

}

enum measurements{
  latitude,
  longitude,
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


// clearMeasurements() {
//   this.data.clearMessages();
//   this.lineChart.data.datasets.forEach(dataset => {
//     dataset.data = [];
//     dataset.labels = [];
//   });
//   this.lineChart.data.labels = []
//   this.lineChart.update();

// }

  /*
  auf zeilenumbruch trennen
  danach auf komma trennen 

    {
      id,value,timestamp,lon,lat,alt
      id2,value2,timestamp2,lon2,lat2,alt2
    }

    
5f9bd0f746592b001b5c6349,     1.0,2020-10-26T13:34:56Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c634a,     2.0,2020-10-26T13:34:56Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c6349,     2.0,2020-10-26T13:34:57Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c634a,     3.0,2020-10-26T13:34:57Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c6349,     3.0,2020-10-26T13:34:58Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c634a,     4.0,2020-10-26T13:34:58Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c6349,     4.0,2020-10-26T13:34:59Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c634a,     5.0,2020-10-26T13:34:59Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c6349,     5.0,2020-10-26T13:35:00Z,   7.631652, 51.954327,   57.8
5f9bd0f746592b001b5c634a,     6.0,2020-10-26T13:35:00Z,   7.631652, 51.954327,   57.8


    
    id=req[0]
    value=req[1]
  */

  // handleRequestCharts(req) { 
  //   try {
  //     const req_arr = req.split('\n');
  //     let normalMeasurements:Array<Measurement> = [];
  //     let abstandLinksMeasurement:Measurement;
  //     req_arr.forEach( (sensor,index) => {
  //       const row = sensor.split(',');
  //       if(row[0].trim() == this.abstandLinks){
  //         // save this row for the next round
  //         // abstand rechts is following right after 
  //         abstandLinksMeasurement = this.data.buildMeasurementFromString(sensor);
  //       }
  //       else if(row[0].trim()== this.abstandRechts){
  //         // now add this row and before to the chart
  //         // reset array for next round
  //         const abstandRechtsMeasurement: Measurement = this.data.buildMeasurementFromString(sensor);
  //         const measurementsArray: Array<Measurement> = [abstandLinksMeasurement,abstandRechtsMeasurement];
  //         const buildingMessage: Message = this.data.buildMessageFromMeasurements(measurementsArray);

  //         measurementsArray.forEach((element,index) => {
  //           this.lineChart.data.datasets[index].data.push(element.value);
  //           //this.lineChart.data.labels.push(element.timestamp.substring(element.timestamp.length - 9, element.timestamp.length - 1));
  //         });
  //         this.data.addMessage(buildingMessage);
  //       }
  //       else {
  //         // 'normal' measurement detected, adding to one message and upload to opensensemap at the end
  //         normalMeasurements.push(this.data.buildMeasurementFromString(sensor));          
  //         if(index == req_arr.length-1){
  //           console.log("end reached uploading");
  //           const labelArray = []
  //           for (let index = 0; index < this.data.getMessagesLength(); index++) {
  //              labelArray.push(index);
  //           }
  //           this.lineChart.data.labels = labelArray;
  //           this.data.addMeasurementsToMessage(this.data.getMessages().length-1,normalMeasurements)
  //           this.lineChart.update();
  //           this.changeDetectorRef.detectChanges();
  //         }
  //       }
  //     });

  //   } catch (error) {
  //     console.log('something wrong with req.body: ', req);
  //     console.log(error);
  //   }
  // }

  // buildChart() {
  //   this.lineChart = new Chart(this.lineCanvas.nativeElement, {
  //     type: "line",
  //     data: {
  //       labels: [],
  //       datasets: [
  //         {
  //           label: "Abstand links",
  //           fill: false,
  //           lineTension: 0.1,
  //           backgroundColor: "#003700",
  //           borderColor: "#003700",
  //           borderCapStyle: "butt",
  //           borderDash: [],
  //           borderDashOffset: 0.0,
  //           borderJoinStyle: "miter",
  //           pointBorderColor: "#003700",
  //           pointBackgroundColor: "#fff",
  //           pointBorderWidth: 1,
  //           pointHoverRadius: 5,
  //           pointHoverBackgroundColor: "#003700",
  //           pointHoverBorderColor: "#003700",
  //           pointHoverBorderWidth: 2,
  //           pointRadius: 1,
  //           pointHitRadius: 10,
  //           data: [],
  //           spanGaps: false
  //         },
  //         {
  //           label: "Abstand rechts",
  //           fill: false,
  //           lineTension: 0.1,
  //           backgroundColor: "#7de8ea",
  //           borderColor: "#7de8ea",
  //           borderCapStyle: "butt",
  //           borderDash: [],
  //           borderDashOffset: 0.0,
  //           borderJoinStyle: "miter",
  //           pointBorderColor: "#7de8ea",
  //           pointBackgroundColor: "#fff",
  //           pointBorderWidth: 1,
  //           pointHoverRadius: 5,
  //           pointHoverBackgroundColor: "#7de8ea",
  //           pointHoverBorderColor: "#7de8ea",
  //           pointHoverBorderWidth: 2,
  //           pointRadius: 1,
  //           pointHitRadius: 10,
  //           data: [],
  //           spanGaps: false
  //         }

  //       ]
  //     },
  //     options: {
  //       scales: {
  //         xAxes: [{
  //           gridLines: {
  //             display: true
  //           },
  //           ticks: {
  //             fontColor: "#333",
  //             autoSkip: true,
  //             maxTicksLimit: 4,
  //             maxRotation: 0,
  //           }
  //         }],
  //         yAxes: [{
  //           gridLines: {
  //             display: true,
  //             drawBorder: false

  //           },
  //           ticks: {
  //             display: true,
  //             fontColor: "#333",
  //             maxTicksLimit: 9,
  //             // suggestedMin: 0,
  //             // suggestedMax: 400
  //           }
  //         }]
  //       },
  //       legend: {
  //         display: true
  //       }
  //     }
  //   }
  //   )
  // }