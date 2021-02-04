// import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Message } from '../services/data.service';
import * as timeago from 'timeago.js';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  constructor() { }

  ngOnInit() {
    }

  displayDate(datestring){
    const date = new Date(datestring);
    return date.toLocaleTimeString();
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
