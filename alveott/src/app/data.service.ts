import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { Clip } from './clip';
import { MonitorService } from './monitor.service';

import { ResponseContentType } from '@angular/http';

@Injectable()
export class DataService {
  selected = null;
  private fetchUrl = 'http://127.0.0.1:5000/request-data'
  clips = [];
  errorMessage: string;
  blob: ArrayBuffer;

  constructor(private http: Http, private monitorService: MonitorService) {};

  getFile(): void {
    this.downloadIt()
          .subscribe(
          blob => this.blob = blob,
          error => this.errorMessage = <any>error);
  }
  private downloadIt(): Observable<ArrayBuffer> {
    return this.http.get('http://127.0.0.1:5000/request-audio', {responseType: ResponseContentType.ArrayBuffer}) 
    .map(response => (<Response>response).arrayBuffer())
                    .catch(this.handleError);
  }

  getData(): void {
    this.fetchData()
          .subscribe(
          clips => this.clips = clips,
          error => this.errorMessage = <any>error);
  }

  raw(): ArrayBuffer {
    return this.blob.slice(0);
  }

  private fetchData(): Observable<Clip[]> {
    return this.http.get(this.fetchUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let data = res.json();
    return data || [];
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
