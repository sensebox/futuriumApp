import { AfterViewInit,ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DataService, Measurement, Message } from '../services/data.service';
import { ArduinoService } from '../services/arduino.service';
import { ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { WebServer } from '@ionic-native/web-server/ngx'
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  elements: Array<any> = [];

  private abstandLinks:string = '5f9bd0f746592b001b5c6349'
  private abstandRechts:string = '5f9bd0f746592b001b5c634a'
  public status:boolean = false;
  interval: any;
  measuring: Boolean = false;
  idArray:Array<string> = ['lat','lng','timestamp','accXID','accYID','accZID','magXID','magYID','magZID','rotXID','rotYID','rotZID','distLeftID','distRightID','tempID','pressID','pm25ID','pm10ID'];


  constructor(
    platform: Platform,
    private data: DataService,
    private arduino: ArduinoService,
    public toastController: ToastController,
    private modalController: ModalController,
    private webServer: WebServer,
    private popoverController: PopoverController,
    private changeDetectorRef: ChangeDetectorRef
  ) {

      
  }

  ngAfterViewInit() {
  };

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DisclaimerComponent,
      cssClass: 'my-custom-class'
    });


    return await modal.present();
  }

  startMeasuring()
  { 
    // Alle 60 sekunden
    

      // build csv here
      /**
       * 
       * const char *header = "longitude,latitude,timestamp,sumAccX,sumAccY,sumAccZ,sumMagX,sumMagY,sumMagZ,sumRotX,sumRotY,sumRotZ,distLeft,distRight,temp,press,pm25,pm10";
                                0         1         2         3
       * [ [1,2,3,4 ], [5,6,7,8]] => id1,1 
       *                             id1,5
       *                             id2,2
       *                             id2,6
       * data.map((item)) => item = [1,2,3,4]
       * make array with indexes according to the measurements 
       * id;lat;lon;timestamp;value
       */
      this.data.addMessage([42222,71111111,20200401121212,3,4,5,5,6,7,7,5,457,6,8,12,643,34,6])
      this.data.addMessage([422223,7222222,20200401121214,8,9,10,67,5,45,1,3,2,346,456,45,456,456,456])

    
  }

  testFunction(){
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
                  + elementOuter[measurements.longitude] + ','
                  + elementOuter[measurements.latitude] + ','
                  + elementOuter[measurements.timestamp] + ','
                  + elementOuter[indexInner] + '\n'
        output+= line;
        line = '';                  
                }               
    }
    console.log("builded",output);
    this.data.clearMessages();
  }

  getActualMessages(){
    const data = this.data.getMessages();

  }

}

enum measurements{
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