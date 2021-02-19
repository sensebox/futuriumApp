import { Injectable } from '@angular/core';


export interface Measurement {
  id: string,
  value: number,
  timestamp: string,
  lon: number,
  lat: number,
  altitude?: number
}
export interface Message {
  date:string,
  measurements:Array<Measurement>
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public measurement:Array<Measurement>=[];
  public messages: Array<any> = [];
  public timestamp: string;
  public osmtimestamp:string
  constructor() { }

  public getMessages(): Array<any> {
    return this.messages.reverse();
  }

  public setMessage(index:number,message:Message):void{
    this.messages[index] = message;
  }

  public setTimestamp(timestamp:string):void{
    this.timestamp = timestamp;
    console.log("timestamp: ",this.timestamp)
  }

  public getTimestamp():string{
    return this.timestamp;
  }

  public setOSMTimestamp(timestamp:string):void{
    this.osmtimestamp = timestamp;
    console.log("timestamp: ",this.osmtimestamp)
  }

  public getOSMTimestamp():string{
    return this.osmtimestamp;
  }

  public addMessage(message:Array<any>): void {
    const addedMessages: Array<any> = this.messages;
    addedMessages.push(message);
    this.messages = addedMessages;
    this.timestamp = this.messages[0][2]
  }


  public clearMessages():void{
    this.messages = [];
  }
}
