import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';

import { ErrorHandler } from './http-errors'

import { AuthService } from './auth.service';
import { DBService } from './db.service';

@Injectable()
export class AlveoService {
  selectedList: any;
  lists: Array<any>;
  audioData: ArrayBuffer;

  constructor(public http: Http,
    public authService: AuthService,
    public dbService: DBService) {
    // Ignore the error if the lists variable doesn't exist
    this.dbService.get('lists').then(result => this.lists = result.lists, error => {});
  }

  apiRequest(url, successCallback, file=false): void {
    if (!this.authService.isLoggedIn())
      return;

    let header = this.authService.buildHeader();
    header.append('X-Api-Key', this.authService.apiKey);

    let options = this.authService.buildOptions(header);
    if (file)
      options.responseType = ResponseContentType.ArrayBuffer;

    console.log("Made request to "+url);
    this.http.get(url, options)
                .subscribe(data => successCallback(data),
                           error => ErrorHandler(error, this));
  }

  getActiveList(): Array<any> {
    return this.selectedList;
  }

  getActiveListData(): Array<any> {
    // If list doesn't contain data, pull it
    if (this.selectedList['_tt_preload'] == undefined) {
      if (this.authService.isLoggedIn()) {
        // Guard against multiple calls?
        console.log("Looks like I don't have that list preloaded, retrieving it now.");
        this.pullList(this.selectedList);
      }
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
      if (this.authService.isLoggedIn()) {
        console.log("Looks like I don't have that lists' data preloaded, retrieving it now.");
        this.pullItem(list)
      }
      return {data:{}};
    }
    return list;
  }

  pullIndex(): void { 
    // Pulls an array of all the lists from Alveo
    this.apiRequest(this.authService.baseURL + '/item_lists',
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

  pullItems(items: any): void {
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
    this.dbService.put("lists", {lists: []});
  }

  startStore(): void {
    setInterval(() => this.storeData(), 3000); 
  }

  storeData(): void {
    this.dbService.put("lists", {lists: this.lists})
  }

  reset(): void {
    this.lists = null;
  }

  resetStore(): void {
    this.dbService.put("lists", {lists: []});
  }
}
