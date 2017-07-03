import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { Clip } from './clip';
import { MonitorService } from './monitor.service';

@Injectable()
export class DataService {
  selected = null;
  private fetchUrl = 'http://127.0.0.1:5000/request-data'
  clips = [];
  errorMessage: string;

  constructor(private http: Http, private monitorService: MonitorService) {};

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
