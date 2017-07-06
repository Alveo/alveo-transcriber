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
  blob: Blob;
  blobdata: string;
  blobtest: ArrayBuffer;

  constructor(private http: Http, private monitorService: MonitorService) {};

  getFile(): void {
    this.downloadIt()
          .subscribe(
          blob => this.blob = blob,
          error => this.errorMessage = <any>error);
  }
  private downloadIt(): Observable<Blob> {
    return this.http.get('http://127.0.0.1:5000/request-audio', {responseType: ResponseContentType.Blob}) 
                    .map(this.blobExtract)
                    .catch(this.handleError);
  }

  private blobExtract(res: Response) {
    var blob = new Blob([res.blob()], {type: 'audio/ogg'});
    return blob;
  }
  
  gen64if(): void {
    if (this.blob!=null) {
      if (this.blobdata==undefined) {
      var reader = new FileReader();
      reader.onload =this._readerhandle.bind(this);
      reader.readAsBinaryString(this.blob);
      }
    }
  }

  _readerhandle(reader) {
    this.blobdata= btoa(reader.target.result);
  }

  genABif(): void {
    if (this.blob!=null) {
      if (this.blobtest==undefined) {
      var reader = new FileReader();
      reader.onload =this._readerhandle2.bind(this);
      reader.readAsArrayBuffer(this.blob);
      }
    }
  }

  _readerhandle2(reader) {
    this.blobtest= reader.target.result;
  }

  getData(): void {
    this.fetchData()
          .subscribe(
          clips => this.clips = clips,
          error => this.errorMessage = <any>error);
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
