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
    data: [],
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
        this.storage.data = lists;
        this.pullLists(this.storage.data);
      });
  }

  pullLists(lists: Array<any>): void {
    for (let list of lists) {
      this.pullList(list.item_list_url, list, true);
    }
  }

  pullList(url: string, arrayMember: any, preload=false): void {
    this.apiRequest(url, (data) => {
      arrayMember['_tt_preload'] = [];
      for (let item_url of data.json().items) {
        arrayMember['_tt_preload'].push({'url': item_url});
      }
      if (preload) { this.pullItems(arrayMember._tt_preload) }
    });
  }

  pullItems(items: any) {
    for (let item of items) {
      this.pullItem(item.url, item, true);
    }
  }

  pullItem(url: string, arrayMember: any, preload=false): void {
    this.apiRequest(url, (data) => {
      arrayMember['data'] = data.json();
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
