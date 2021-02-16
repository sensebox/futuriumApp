import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Message } from '../services/data.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  public message: Message;
  stringArray:Array<string> =  ["latitude",
    "longitude",
    "timestamp",
    "accX",
    "accY",
    "accZ",
    "magX",
    "magY",
    "magZ",
    "rotX",
    "rotY",
    "rotZ",
    "distLeft",
    "distRight",
    "temp",
    "press",
    "pm25",
    "pm10"];
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const index = this.activatedRoute.snapshot.paramMap.get('index');
    this.message = this.data.getMessages()[index];
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? this.message[2] : this.message[2];
  }
}
