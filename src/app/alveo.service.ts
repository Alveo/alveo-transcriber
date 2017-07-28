import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';

import { ErrorHandler } from './http-errors'
import { AppUtilService } from './app-util.service';

@Injectable()
export class AlveoService {
  selectedList: any;
  lists: Array<any>;

  constructor(
    public http: Http,
    public appService: AppUtilService)
  {
    this.appService.database.get('lists').then(result => this.lists = result.lists);
    //this.startStore();
  }

  apiRequest(url, successCallback): void {
    let header = this.appService.auth.buildHeader();
    header.append('X-Api-Key', this.appService.auth.apiKey);

    this.http.get(url, this.appService.auth.buildOptions(header))
                .subscribe(data => successCallback(data),
                           error => ErrorHandler(error, this));
  }

  apiFileRequest(url, successCallback): void {
    let header = new Headers({
        'Accept': 'application/json',
        'responseType': String(ResponseContentType.ArrayBuffer)
      });
    header.append('X-Api-Key', this.appService.auth.apiKey);

    this.http.get(url, this.appService.auth.buildOptions(header))
                .subscribe(data => successCallback(data),
                           error => ErrorHandler(error, this));
  }

  getActiveList(): any {
    return this.selectedList;
  }

  getActiveListData(): any {
    // If list doesn't contain data, pull it
    if (this.selectedList['_tt_preload'] == undefined) {
      // Guard against multiple calls?
      console.log("Looks like I don't have that list preloaded, retrieving it now.");
      this.pullList(this.selectedList);

      return [];
    }
    return this.selectedList['_tt_preload'];
  }

  getListItemData(list: any): any {
    // If list doesn't contain data, pull it
    if (list.url == undefined) {
      // Guard against multiple calls?
      console.log("Looks like I don't have that list preloaded, call getListData() first.");
      return {data:{}};
    }

    if (list.data == undefined) {
      console.log("Looks like I don't have that lists' data preloaded, retrieving it now.");
      this.pullItem(list)
      return {data:{}};
    }
    return list;
  }

  pullIndex(): void { 
    console.log("Pulled");
    this.apiFileRequest("https://staging.alveo.edu.au/catalog/austalk/1_114_3_8_001/document/1_114_3_8_001-ch6-speaker.wav",
      (data) => {
        console.log(data);
      });
    // Pulls an array of all the lists from Alveo
    this.apiRequest(this.appService.auth.baseURL + '/item_lists',
      (data) => {
        let lists = [];
        lists = lists.concat(data.json().own);
        lists = lists.concat(data.json().shared);

        this.lists = lists;
      });
  }

  pullLists(lists: Array<any>): void {
    for (let list of lists) {
      this.pullList(list);
    }
  }

  pullList(list: any, chainload=false): void {
    this.apiRequest(list.item_list_url, (data) => {
      list['_tt_preload'] = [];
      for (let item_url of data.json().items) {
        list['_tt_preload'].push({'url': item_url});
      }
      if (chainload) { this.pullItems(list._tt_preload) }
    });
  }

  pullItems(items: any) {
    for (let item of items) {
      this.pullItem(item, true);
    }
  }

  pullItem(item: any, chainload=false): void {
    this.apiRequest(item.url, (data) => {
      item['data'] = data.json();
    });
  }

  pullDoc(doc: any) {
  }

  getLists(): any {
    return this.lists;
  }

  flushCache(): void {
    this.appService.database.put("lists", {lists: []});
  }

  startStore(): void {
    setInterval(() => {this.appService.database.put("lists", {lists: this.lists})}, 3000);
  }
}
