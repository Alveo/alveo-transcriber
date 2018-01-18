import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/Observable';

import { DBService } from './db.service';
import { AnnotatorService } from '../../annotator/shared/annotator.service';

import { Paths } from './paths';

@Injectable()
export class SessionService {
  private list_index: any = null;
  private stored_route: any = [];
  private active_list: any = null;
  private active_doc: any = null;
  private active_doc_data: ArrayBuffer = null;
  private load_init = true;

  constructor(
    private router: Router,
    private annotatorService: AnnotatorService,
    private dbService: DBService) {
    this.dbService.get("sessionService").then(
      data => {
        console.log("Stored session data has been found and loaded.");

        this.active_list = data['active_list'];
        this.active_doc = data['active_doc'];
        this.active_doc_data = data['active_doc_data'];
        this.stored_route = data['stored_route'];

        this.load_init = false;
      },
      error => {
        console.log("Stored session data not found. Initialising.");

        this.updateStorage();

        this.load_init = false;
      }
    );
  }

  public onReady(): Observable<any> {
    return new Observable(
      (observer) => {
        let interval = setInterval(() => {
          if (this.load_init === false) {
            observer.next();
            observer.complete();
            clearInterval(interval);
          }
        }, 5);
      }
    );
  }

  private updateStorage() {
    this.dbService.put("sessionService", {
      "stored_route": this.stored_route,
      "active_list": this.active_list,
      "active_doc": this.active_doc,
      "active_doc_data": this.active_doc_data,
    });
  }

  private dbRequest(storageName: string): Observable<any> {
    return new Observable((observer) =>
      {
        this.dbService.get(storageName).then(
          storageName => {
            observer.next(storageName[storageName]);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    );
  }

  /* Navigate to the specified route if possible */
  public navigate(route: any[]): Promise<any> {
    return new Promise(
      (success, error) => {
        this.router.navigate(route)
          .then(data => {
            this.stored_route = route;
            this.updateStorage();
            success(data);
          })
          .catch(errorMsg =>  {
            error(errorMsg)
          })
      }
    );
  }

  public navigateToStoredRoute() {
    this.navigate(this.stored_route);
  }

  public resetSession() {
    this.navigate([Paths.Index]);

    if (!this.load_init) {
      this.setActiveList(null);
      this.setActiveDoc(null, null);
    }
  }

  public setListIndex(list_index: any) {
    this.list_index = list_index;
    this.updateStorage();
  }

  public getListIndex(): any {
    return this.list_index;
  }

  public setActiveList(list: any) {
    this.active_list = list;
    this.updateStorage();
  }

  public getActiveList(): any {
    return this.active_list;
  }

  public setActiveDoc(doc: any, docData: ArrayBuffer) {
    this.active_doc = doc;
    this.active_doc_data = docData;
    this.updateStorage();

    /* TMP */
    this.annotatorService.audioFile = docData;
    this.annotatorService.rebase([]);
    if (doc != null) {
      this.annotatorService.audioFileName = doc['dcterms:identifier'];
      this.annotatorService.audioFileURL = doc['alveo:url'];
    }
  }

  public getActiveDoc(): any {
    return this.active_doc;
  }

  public getActiveDocData(): any {
    return this.active_doc_data;
  }
}
