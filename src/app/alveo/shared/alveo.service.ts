import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ErrorHandler } from './http-errors';

import { AuthService } from './auth.service';
import { DBService } from './db.service';
import { ApiService } from './api.service';
import { AnnotatorService } from '../../annotator/shared/annotator.service';

import { Annotation } from '../../annotator/shared/annotator.service';

@Injectable()
export class AlveoService {
  selectedList: any;
  lists: Array<any>;
  annotationSubscription: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private annotatorService: AnnotatorService,
    private dbService: DBService) {
    // TODO Move elsewhere
    // Ignore the error if the lists variable doesn't exist
    this.dbService.get('lists').then(result => this.lists = result.lists, error => {});
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

  /* Returns all lists associated with the user */
  public getListDirectory(force= false): Observable<any> {
    return new Observable((observer) =>
      {
        this.dbService.get('lists').then(
          lists => {
            observer.next(lists.lists);
            observer.complete();
          },
          error => {
            if (!this.authService.isApiAuthed()) {
              observer.error("Warning: getListDirectory() ignored: no cache, not logged in");
            } else {
              this.apiService.getListIndex()
                .subscribe(
                  (data) => {
                    let lists = [];
                    lists = lists.concat(data['own']);
                    lists = lists.concat(data['shared']);

                    this.lists = lists;

                    observer.next(lists);
                    observer.complete();
                  },
                  error => {
                    ErrorHandler(error, this);
                    observer.error(error);
                  }
                );
            }
          }
        )
      });
  }

    /*
  public getList(listUrl: string, force= false): Observable<any> {
    this.apiService.getList(list.item_list_url)
      .subscribe(
        (data) => {
          // TODO
          return data
        },
        error => ErrorHandler(error, this)
      );
  }

  public getItem(itemUrl: any, force= false): Observable<any> {
    this.apiService.getItem(item.url)
      .subscribe(
        (data) => {
          // TODO
          return data;
        },
        error => ErrorHandler(error, this)
      );
  }

  public getAudioFile(docUrl: any, callback= null) {
    const url = doc['alveo:url'];

    this.apiService.getDocument(url)
      .subscribe(
        (data) => {
          doc['_alveott_data'] = data;

          if (callback != null) {
            callback(data);
          }
        },
        error => ErrorHandler(error, this)
      );
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
     */
}
