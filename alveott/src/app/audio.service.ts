import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';

import { Audio } from './audio';

// private fetchUrl = 'http://127.0.0.1:5000/request-data'

@Injectable()
export class AudioService {
  audioStore: Array<Audio>;
  errorMessage: string;

  constructor(private http: Http) {
    this.audioStore = new Array<Audio>();
  }

  pull(url: string): void {
    this.download(url)
          .subscribe(
            data => {
              let audio = new Audio();
              audio.data = data;
              this.audioStore.push(audio);
            },
          error => this.errorMessage = <any>error);
  }

  private download(url: string): Observable<ArrayBuffer> {
    return this.http.get(url, {responseType: ResponseContentType.ArrayBuffer}) 
    .map(response => (<Response>response).arrayBuffer())
                    .catch(this.handleError);
  }

  raw(): ArrayBuffer {
    return this.audioStore[0].data.slice(0);
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
