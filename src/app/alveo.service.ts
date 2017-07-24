import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { ErrorHandler } from './http-errors'
import { AppUtilService } from './app-util.service';

@Injectable()
export class AlveoService {
  lists: any;

  constructor(
    public http: Http,
    public appService: AppUtilService) {}

  pullLists(): void {
    let header = this.appService.auth.buildHeader();
    header.append('X-Api-Key', this.appService.auth.apiKey);

    this.http.get(this.appService.auth.baseURL + '/item_lists', this.appService.auth.buildOptions(header))
                .subscribe(data => this.lists = data.json().own, //what about cat 'shared'?
                           error => ErrorHandler(error, this));
  }

  startStore(): void {
    //setInterval(() => {this.appService.database.put("clips", {clips: this.clips})}, 1000);
  }
}
