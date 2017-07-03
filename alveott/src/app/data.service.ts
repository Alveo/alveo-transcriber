import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { Clip } from './clip';

@Injectable()
export class DataService {
  // TODO sync clips from /request-dat
  // TODO more useful tests
  // deploy script
  //
  selected = null;
  private fetchUrl = 'http://127.0.0.1:5000/request-data'
  clips = [];
  errorMessage: string;

  //this.dataService.pullData().then(clips => this.clips = clips);
  //var vm = this;
  /* TODO Breaks unit tests, 'look at takeuntil()' to get around it
   * this.syncObs().subscribe(
    function() {
      if (vm.online$) {
        console.log("Online");
      } else {
        console.log("Offline");
      };
    });
   */

  private online$: boolean = navigator.onLine;
  constructor(private http: Http) {
    window.addEventListener('online', () => {this.online$ = true});
    window.addEventListener('offline', () => {this.online$ = false});
  };

  syncObs = () => {
    return Observable
        .interval(5000);
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
