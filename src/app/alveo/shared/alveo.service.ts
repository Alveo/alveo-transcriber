import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ErrorHandler } from './http-errors'

import { AuthService } from './auth.service';
import { DBService } from './db.service';

import { AnnotatorService } from '../../annotator/shared/annotator.service';
import { Annotation } from '../../annotator/shared/annotator.service';

@Injectable()
export class AlveoService {
  selectedList: any;
  lists: Array<any>;
  annotationSubscription: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private annotatorService: AnnotatorService,
    private dbService: DBService) {
    // TODO Move elsewhere
    // Ignore the error if the lists variable doesn't exist
    this.dbService.get('lists').then(result => this.lists = result.lists, error => {});
  }

  private buildHeader(): any {
    return { headers: new HttpHeaders(
      {
        'X-Api-Key': this.authService.apiKey,
        'Accept': 'application/json'
      }
    )};
  }

  private apiRequest(url, successCallback, errorCallback= null, file= false): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    if (errorCallback === null) {
      errorCallback = ErrorHandler;
    }

    const requestOptions = this.buildHeader();
    if (file) {
      requestOptions.responseType = 'arraybuffer';
    }

    console.log('Made request to ' + url);
    this.http.get(url, requestOptions)
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
    this.dbService.put('lists', {lists: []});
  }

  startStore(): void {
    setInterval(() => this.storeData(), 3000);
  }

  storeData(): void {
    this.dbService.put('lists', {lists: this.lists})
  }

  reset(): void {
    this.lists = null;
  }

  resetStore(): void {
    this.dbService.put('lists', {lists: []});
  }
  /* ********* */

  /* 1. Pull the list directory
   * 2. Pull an actual list
   * 3. Pull the items of a list, which also contains the document metadata
   * 4. Pull any needed files
   */

  /* TODO Promises */

  /* Returns all lists associated with the user */
  public getListDirectory(callback= null): any {
    this.pullListDirectory(callback);
  }

  /* Pulls all lists associated with the user */
  private pullListDirectory(callback= null): void {
    // Pulls an array of all the lists from Alveo
    this.apiRequest(this.authService.baseURL + '/item_lists',
      (data) => {
        let lists = [];
        lists = lists.concat(data.own);
        lists = lists.concat(data.shared);

        this.lists = lists;

        if (callback != null) {
          callback(lists);
        }
      }
    );
  }

  /* Pulls a list, supports chainloading */
  private pullList(list: any, chainload= false, callback= null): void {
    this.apiRequest(list.item_list_url, (data) => {
      list['_alveott_data'] = [];
      for (const item_url of data.items) {
        list['_alveott_data'].push({'url': item_url});
      }
      if (chainload) { this.chainLoadItems(list['_alveott_data']) }

      if (callback != null) {
        callback(data);
      }
    });
  }

  /* Returns a list, pulling it if not downloaded yet */
  public getItems(list: any, callback= null): Array<any> {
    // If list doesn't contain data, pull it
    if (list['_alveott_data'] === undefined) {
      if (this.authService.isLoggedIn()) {
        this.pullList(list, false, callback);
      } else {
        if (callback != null) {
          callback(403);
        }
      }
      return [];
    }
    if (callback != null) {
      callback(list['_alveott_data']);
    }
    return list['_alveott_data'];
  }

  /* Pulls and populates every single item from a list */
  private chainLoadItems(list: any): void {
    for (const item of list) {
      this.pullItem(item, true);
    }
  }

  /* Pulls and populates an item entry */
  private pullItem(item: any, chainload= false, callback= null): void {
    item['alveott_download'] = true;
    this.apiRequest(item.url, (data) => {
      item['data'] = data;

      if (callback != null) {
        callback(data);
      }
      item['alveott_download'] = false;
    });
  }

  /* Determines whether an item has been downloaded */
  public getItemStatus(item: any): any {
    if (item['data'] === undefined) {
      if (item['alveott_download'] === true) {
        return 'Downloading';
      }
      return 'Ready to download';
    } else if (item['_alveott_annotations'] !== undefined && item['_alveott_annotations'].length > 0) {
      return 'Cached - Transcribed';
    }
    return 'Cached';
  }

  /* Returns documents list if available, else fetches it */
  getDocs(item: any, callback= null): any {
    if (item.data === undefined) {
      /* Only the item location has been downloaded. Item needs to be downloaded. */
      if (this.authService.isLoggedIn()) {
        this.pullItem(item, false, callback)
      } else {
        if (callback != null) {
          callback(403);
        }
      }
      return [];
    }
    if (callback != null) {
      callback(item.data['alveo:documents']);
    }
    return item.data['alveo:documents'];
  }

  getAudioFile(doc: any, callback= null): any {
    if (doc['_alveott_data'] === undefined) {
      if (this.authService.isLoggedIn()) {
        this.pullAudioFile(doc, callback);
      } else {
        if (callback != null) {
          callback(403);
        }
      }
      return null;
    }
    if (callback != null) {
      callback(doc['_alveott_data']);
    }

    return doc['_alveott_data'];
  }

  private pullAudioFile(doc: any, callback= null) {
    const url = doc['alveo:url'];
    this.apiRequest(url,
      (data) => {
        doc['_alveott_data'] = data;

        if (callback != null) {
          callback(data);
        }
      },
    undefined, true);
  }

  getAnnotations(item: any): any {
    let annotations = item['_alveott_annotations']
    if (annotations === undefined) {
      annotations = [];
    }
    return annotations;
  }

  setAnnotations(item: any, annotations: Array<Annotation>) {
    item['_alveott_annotations'] = annotations;
  }

  watchAnnotations(item: any, watcher: any) {
    if (this.annotationSubscription != null) {
      this.annotationSubscription.unsubscribe();
    }
    this.annotationSubscription = watcher.subscribe((event: any) => {
      this.setAnnotations(item, this.annotatorService.annotations);
    });
  }
}
