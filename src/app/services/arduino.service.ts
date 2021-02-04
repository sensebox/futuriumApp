import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import {timeout} from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class ArduinoService {

  constructor(private http: HttpClient) { }


  public getData(){
    const headers = new HttpHeaders ({'Access-Control-Allow-Headers':'*','Access-Control-Allow-Origin':'*','Content-Type': 'text' })
    const url = `http://192.168.1.1/`;
    return this.http.get(url,{headers})
          .pipe(timeout(10000));
        }

    public pingOSEM(){
      const url = `https://api.opensensemap.org/boxes/5bb610bf043f3f001b6a4c53/`
      return this.http.get(url)
            .pipe(timeout(30000));
    }
}