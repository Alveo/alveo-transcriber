import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { ErrorHandler } from './http-errors'
import { AppUtilService } from './app-util.service';

@Injectable()
export class AlveoService {
  storage: any = {
    lists: [],
    items: [],
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

  pullIndex(): void { 
    // Pulls an array of all the lists from Alveo
    this.apiRequest(this.appService.auth.baseURL + '/item_lists',
      (data) => {
        let lists = [];
        lists = lists.concat(data.json().own);
        lists = lists.concat(data.json().shared);
        this.storage.lists = lists;
        this.pullLists(this.storage.lists);
      });
  }

  pullLists(lists: Array<any>): void {
    for (let list of lists) {
      this.pullList(list.item_list_url, true);
    }
  }

  pullList(url: string, preload: boolean): void {
    this.apiRequest(url, (data) => {
      //this.storage.items.push(data.json());
      if (preload) { console.log(data.json().items); this.pullItems(data.json().items);}
    });
  }

  pullItems(items: Array<any>) {
    for (let item of items) {
      this.pullItem(item, true);
    }
  }

  pullItem(url: string, preload: boolean): void {
    this.apiRequest(url, (data) => {
      //this.storage.items.push(data.json());
      if (preload) { console.log(data.json()); this.pullDocs(data.json().items);}
    });
  }

  pullDocs(url: Array<any>) {
  }

  flushCache(): void {
    this.storage.lists = null;
    this.storage.items = null;
  }

  startStore(): void {
    //setInterval(() => {this.appService.database.put("clips", {clips: this.clips})}, 1000);
  }
}
