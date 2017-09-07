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
    // TODO Move elsewhere
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

  /* TODO Move all of these elsewhere */
  getActiveList(): Array<any> {
    return this.selectedList;
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
  /* ********* */

  /* 1. Pull the list directory
   * 2. Pull an actual list
   * 3. Pull the items of a list, which also contains the document metadata
   * 4. Pull any needed files
   */

  /* Returns all lists associated with the user */
  public getListDirectory(callback=null): any {
    this.pullListDirectory(callback);
  }

  /* Pulls all lists associated with the user */
  private pullListDirectory(callback=null): void { 
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
      }
    );
  }

  /* Pulls a list, supports chainloading */
  private pullList(list: any, chainload=false, callback=null): void {
    this.apiRequest(list.item_list_url, (data) => {
      list['_alveott_data'] = [];
      for (let item_url of data.json().items) {
        list['_alveott_data'].push({'url': item_url});
      }
      if (chainload) { this.chainLoadItems(list['_alveott_data']) }

      if (callback != null) {
        callback(data);
      }
    });
  }

  /* Returns a list, pulling it if not downloaded yet */
  public getItems(list: any, callback=null): Array<any> {
    // If list doesn't contain data, pull it
    if (list['_alveott_data'] == undefined) {
      if (this.authService.isLoggedIn()) {
        // Guard against multiple calls?
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
    return list['_alveott_data'];
  }

  /* Pulls and populates every single item from a list */
  private chainLoadItems(list: any): void {
    for (let item of list) {
      this.pullItem(item, true);
    }
  }

  /* Pulls and populates an item entry */
  private pullItem(item: any, chainload=false, callback=null): void {
     this.apiRequest(item.url, (data) => {
       item['data'] = data.json();

       if (callback != null) {
         callback(data);
       }
     });
  }

  /* Returns documents list if available, else fetches it */
  getDocs(item: any, callback=null): any {
    if (item.data == undefined) {
      /* Only the item location has been downloaded. Item needs to be downloaded. */
      if (this.authService.isLoggedIn()) {
        this.pullItem(item, false, callback)
      }
      return [];
    }
    if (callback != null) {
      callback(null);
    }
    return item.data['alveo:documents'];
  }

  getAudioFile(url: string, callback=null): any {
    /* TODO Should check if the audio file is downloaded */
    this.pullAudioFile(url, callback);
  }

  private pullAudioFile(url: string, callback=null) {
    this.apiRequest(url,
      (data) => {
        this.audioData = data.arrayBuffer();
        /* TODO Should save the audio file */

        if (callback != null) {
          callback(data);
        }
      },
    true);
  }
}
