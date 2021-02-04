import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Array<any>;
  @Input() index: number;
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
