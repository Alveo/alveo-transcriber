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

  getIndex(callback=null): any {
    this.pullIndex(callback);
  }

  getActiveList(): Array<any> {
    return this.selectedList;
  }

  getListData(list: any, callback=null): Array<any> {
    // If list doesn't contain data, pull it
    if (list['_tt_preload'] == undefined) {
      if (this.authService.isLoggedIn()) {
        // Guard against multiple calls?
        console.log("Looks like I don't have that list preloaded, retrieving it now.");
        this.pullList(list, false, callback);
      } else {
        if (callback != null) {
          callback(403);
        }
      }
      return [];
    }
    if (callback != null) {
      callback(null);
    }
    return list['_tt_preload'];
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

  getAudioFile(url: string, callback=null): any {
    this.pullAudioFile(url, callback);
  }

  private pullAudioFile(url: string, callback=null) {
    this.apiRequest(url,
      (data) => {
        this.audioData = data.arrayBuffer();

        if (callback != null) {
          callback(data);
        }
      },
    true);
  }

  private pullIndex(callback=null): void { 
    // Pulls an array of all the lists from Alveo
    this.apiRequest(this.authService.baseURL + '/item_lists',
      (data) => {
        let lists = [];
        lists = lists.concat(data.json().own);
        lists = lists.concat(data.json().shared);

        this.lists = lists;
        
        if (callback != null) {
          callback(data);
        }
      });
  }

  private pullLists(lists: Array<any>): void {
    for (let list of lists) {
      this.pullList(list);
    }
  }

  private pullList(list: any, chainload=false, callback=null): void {
    this.apiRequest(list.item_list_url, (data) => {
      list['_tt_preload'] = [];
      for (let item_url of data.json().items) {
        list['_tt_preload'].push({'url': item_url});
      }
      if (chainload) { this.pullItems(list._tt_preload) }

      if (callback != null) {
        callback(data);
      }
    });
  }

  private pullItems(items: any): void {
    for (let item of items) {
      this.pullItem(item, true);
    }
  }

  private pullItem(item: any, chainload=false, callback=null): void {
     this.apiRequest(item.url, (data) => {
       item['data'] = data.json();

       if (callback != null) {
         callback(data);
       }
     });
  }

  private pullDoc(doc: any) {
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
