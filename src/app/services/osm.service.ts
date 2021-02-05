import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class OsmService {

  private URL_user = 'https://api.opensensemap.org/users/me/boxes';
  private URL_sketch = 'https://api.opensensemap.org/boxes/';

  constructor(
    private http: HttpClient
  ) { }

  getUserBoxes(token: string) {
    const headers = new HttpHeaders({ 'Authorization': "Bearer " + token })
    return this.http.get(this.URL_user, { headers })
      .pipe(timeout(30000))
  }

  getBox(boxid:string){
    const url = `https://api.opensensemap.org/boxes/${boxid}/`
    return this.http.get(url)
          .pipe(timeout(30000));
  }


  getUserSketch(token: string, id: string, ssid: string, password: string) {
    const headers = new HttpHeaders({ 'Authorization': "Bearer " + token })
    return this.http.get(`${this.URL_sketch}${id}/script?ssid=${ssid}&password=${password}`, { headers, responseType: 'text' })
      .pipe(timeout(30000))
  }

  getMeanMeasurements(boxid, phenomenon, fromDate, toDate, window) {
    const url = `https://api.opensensemap.org/statistics/descriptive?boxId=${boxid}&phenomenon=${phenomenon}&fromDate=${fromDate}&toDate=${toDate}&operation=arithmeticMean&window=${window}&format=json`
    return this.http.get(url)
      .pipe(timeout(30000))
  }


  getLastMeasurements(boxid, sensorid) {
    const url = `https://api.opensensemap.org/boxes/${boxid}/data/${sensorid}`
    return this.http.get(url)
      .pipe(timeout(30000))
  }
  getUserLocation() {

  }

  uploadToSenseBox(wifiSecurity, ssid, passwordWifi,boxid, sensors, ipSettings) {

    //192.168.1.1?wifiSecurity=WPA&network=LANCOM&password=XLC251yz!&Temperatur=None&Luftdruck=None&Luftfeuchte=None&Licht=5c4f75e83580950019240776&UV=5c4f75e83580950019240775&PM10=None&PM25=None&ipSettings=ip0

    const url = `http://192.168.1.1/?wifiSecurity=${wifiSecurity}&network=${ssid}&password=${passwordWifi}&senseboxid=${boxid}&Temperatur=${sensors.temperature}&Luftdruck=${sensors.pressure}&Luftfeuchte=${sensors.humidity}&Licht=${sensors.light}&UV=${sensors.uv}&PM10=${sensors.pm10}&PM25=${sensors.pm25}&ipSettings=${ipSettings}`

    console.log(url);
    const headers = new HttpHeaders({ 'Content-Type': 'text' })

    return this.http.post(url,{},{headers})
      .pipe(timeout(3000))
  }

  postMultipleMeasurements(token:string,boxId:string,csv:string){
    // csv should look like 
    /**
     * anotherSensorId,value,RFC 3339-timestamp,longitude,latitude
       anotherSensorId,value,RFC 3339-timestamp,longitude,latitude,height
     */
    console.log("CSV looks like: ", csv);
    const url = `https://api.opensensemap.org/boxes/${boxId}/data`;
    // const headers = new HttpHeaders({'Content-Type': 'text/csv','Authorization': "Bearer " + token});
    const headers = new HttpHeaders({'Content-Type': 'text/csv'});
    return this.http.post(url,csv,{headers})
              .pipe(timeout(30000));
  }


}

