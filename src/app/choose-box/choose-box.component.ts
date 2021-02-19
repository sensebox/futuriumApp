import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'app-choose-box',
  templateUrl: './choose-box.component.html',
  styleUrls: ['./choose-box.component.scss'],
})
export class ChooseBoxComponent implements OnInit {
  @Input() data: any;
  private sensorNames:Array<string> = 
  [
    "accZ",
    "accX",
    "accY",
    "magZ",
    "magX",
    "magY",
    "rotZ",
    "rotX",
    "rotY",
    "distRight",
    "distLeft",
    "temp",
    "humi",
    "pm10",
    "pm25"
  ]
  constructor(
    private modalController: ModalController,
    private router: Router,
    private toastController: ToastController,
    private storage: Storage
  ) { }
  ngOnInit() {
    console.log(this.data.data.boxes);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Wrong Box',
      duration: 2000
    });
    toast.present();
  }
  chooseBox(box){
    if(box.sensors.length!==15){
      this.presentToast();
    }
    else {
      this.storage.set("boxid",box._id);
      this.storage.set("access_token",box.access_token)
      this.sensorNames.map((sensor,index)=>{
        this.storage.set(sensor,box.sensors[index]._id)
      })
      this.dismiss();
      this.router.navigate(['landing'])

    }

  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
