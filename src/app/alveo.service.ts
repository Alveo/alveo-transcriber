import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';

import { AppUtilService } from './app-util.service';
import { Clip } from './clip';

@Injectable()
export class DataService {
  selected = null;
  clips = [];
  errorMessage: string;

  constructor(
    private http: Http,
    public appService: AppUtilService) {}

  startStore(): void {
    setInterval(() => {this.appService.database.put("clips", {clips: this.clips})}, 1000);
  }

  pull(url: string): void {
    this.download(url)
          .subscribe(
          clips => this.clips = clips,
          error => this.errorMessage = <any>error);
  }

  private download(url: string): Observable<Clip[]> {
    return this.http.get(url)
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
