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

  constructor() { }

  public getMessages(): Array<any> {
    return this.messages.reverse();
  }

  public setMessage(index:number,message:Message):void{
    this.messages[index] = message;
  }

  public addMessage(message:Array<number>): void {
    console.log("add message");
    const addedMessages: Array<any> = this.messages;
    addedMessages.push(message);
    this.messages = addedMessages;
  }
  public getMessagesLength(): number{
    return this.messages.length;
  }
 // using date is identifier
  public getMessageByDate(date:string): any {
    let returnedMessage: Message;
    this.messages.forEach(message => {
      if (message.date == date)
        returnedMessage = message;
    });
    return returnedMessage;
  }

  public buildMeasurementFromString(csv:string):Measurement{
    const helperArray = csv.split(',');
    const buildingMeasurement = {
      id: helperArray[0],
      value: parseFloat(helperArray[1]),
      timestamp: helperArray[2],
      lon: parseFloat(helperArray[3]),
      lat: parseFloat(helperArray[4]),
      altitude: parseFloat(helperArray[5])
    }
    
    return buildingMeasurement;
  }

  public buildMessageFromMeasurements(measurements:Array<Measurement>):Message{
    const returnedMessage:Message = {
      date: measurements[0].timestamp,
      measurements
    }

    return returnedMessage;
  }

  public addMeasurementsToMessage(index:number,measurements:Array<Measurement>):void{
    const toEditMessage = this.getMessages()[index];
    const newMessage:Message = {
      date:toEditMessage.date,
      measurements:toEditMessage.measurements.concat(measurements)
    }
    this.setMessage(index,newMessage)
     

  }

  public clearMessages():void{
    this.messages = [];
  }
}
