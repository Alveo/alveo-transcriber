import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { ErrorHandler } from './http-errors'
import { AppUtilService } from './app-util.service';

@Injectable()
export class AlveoService {
  storage: any = {
    lists: null,
    items: null,
  };

  constructor(
    public http: Http,
    public appService: AppUtilService) {}

  apiRequest(url, successCallback): void {
    let header = this.appService.auth.buildHeader();
    header.append('X-Api-Key', this.appService.auth.apiKey);

    this.http.get(url, this.appService.auth.buildOptions(header))
                .subscribe(data => successCallback(data),
                           error => ErrorHandler(error, this));
  }

  pullLists(): void { 
    this.apiRequest(this.appService.auth.baseURL + '/item_lists',
      (data) => this.storage.lists = data.json().own); // cat shared list?
  }

  pullItems(url: string): void {
    this.apiRequest(url, (data) => this.storage.items = data.json());
  }

  startStore(): void {
    //setInterval(() => {this.appService.database.put("clips", {clips: this.clips})}, 1000);
  }
}
