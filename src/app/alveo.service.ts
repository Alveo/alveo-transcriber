import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { ErrorHandler } from './http-errors'
import { AppUtilService } from './app-util.service';

@Injectable()
export class AlveoService {
  storage: any = {
    lists: [],
    list: {},
  };

  constructor(
    public http: Http,
    public appService: AppUtilService) {}

  apiRequest(url, key): void {
    let header = this.appService.auth.buildHeader();
    header.append('X-Api-Key', this.appService.auth.apiKey);

    this.http.get(url, this.appService.auth.buildOptions(header))
                .subscribe(data => this.storage[key] = data.json().own, //what about cat 'shared'?
                           error => ErrorHandler(error, this));
  }

  pullLists(): void { 
    this.apiRequest(this.appService.auth.baseURL + '/item_lists', 'lists');
  }

  pullList(url: string): void {
    this.apiRequest(url, 'list');
  }

  startStore(): void {
    //setInterval(() => {this.appService.database.put("clips", {clips: this.clips})}, 1000);
  }
}
