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
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dbService: DBService) {
  }

  private dbRequest(storageName: string): Observable<any> {
    return new Observable((observer) =>
      {
        this.dbService.get(storageName).then(
          storageName => {
            observer.next(storageName[storageName]);
            observer.complete();
          },
          error => observer.error("404")
        );
      }
    );
  }

  private apiRequest(request: Observable<any>): Observable<any> {
    return new Observable((observer) =>
      {
        if (this.authService.isApiAuthed()) {
          request.subscribe(
            data => {
              observer.next(data);
              observer.complete();
            },
            error => observer.error(error)
          );
        } else {
          observer.error("Warning: API request ignored: not API authed");
        }
      }
    );
  }

  private retrieve(
    request: Observable<any>,
    storageClass: string,
    useCache= true): Observable<any>
  {
    return new Observable((observer) =>
      {
        new Observable((cacheObserver) =>
          {
            if (useCache) {
              this.dbRequest(storageClass).subscribe(
                data => {cacheObserver.next(data); cacheObserver.complete()},
                error => cacheObserver.error(error)
              );
            } else {
              observer.error("Cache request not allowed");
            }
          }).subscribe(
            data => {observer.next(data); observer.complete},
            error => {
              this.apiRequest(request).subscribe(
                data => {
                  // if (useCache)
                  //  invoke sttorage call

                  observer.next(data);
                  observer.complete;
                },
                error => {
                  //ErrorHandler(error, this);
                  observer.error(error);
                }
              )
            }
          );
      }
    );
  }

  public getListDirectory(useCache= true): Observable<any> {
    return this.retrieve(this.requestListDirectory(), 'listDirectory', useCache);
  }

  private requestListDirectory(): Observable<any> {
    return new Observable((observer) =>
      {
        this.apiService.getListIndex().subscribe(
          (data) => {
            let lists = [];
            lists = lists.concat(data['own']);
            lists = lists.concat(data['shared']);

            observer.next(lists);
            observer.complete();
          },
          error => observer.error(error)
        );
      }
    );
  }

  public getList(listUrl: string, useCache= true): Observable<any> {
    return this.retrieve(this.requestList(listUrl), 'lists', useCache);
  }

  public requestList(listUrl: string): Observable<any> {
    return new Observable((observer) =>
      {
        this.apiService.getList(listUrl).subscribe(
          (data) => {
            observer.next(data);
            observer.complete();
          },
          error => observer.error(error)
        );
      }
    );
  }

  public getItem(item: any, useCache= true): Observable<any> {
    return this.retrieve(this.requestItem(item.url), 'items', useCache);
  }

  public requestItem(itemUrl: string): Observable<any> {
    return new Observable((observer) =>
      {
        this.apiService.getItem(itemUrl).subscribe(
          (data) => {
            // todo

            observer.next(data);
            observer.complete();
          },
          error => observer.error(error)
        );
      }
    );
  }

  public getAudioFile(doc: any, useCache= true): Observable<any> {
    return this.retrieve(this.requestAudioFile(doc['alveo:url']), 'audioFiles', useCache);
  }

  public requestAudioFile(audioFileUrl: any) {
    return new Observable((observer) =>
      {
        this.apiService.getDocument(audioFileUrl).subscribe(
          (data) => {
            // todo

            observer.next(data);
            observer.complete();
          },
          error => observer.error(error)
        );
      }
    );
  }
}
