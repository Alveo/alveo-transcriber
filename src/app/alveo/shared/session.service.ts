import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/Observable';

import { DBService } from './db.service';
import { AnnotatorService } from '../../annotator/shared/annotator.service';
import { AlveoService } from './alveo.service';

import { Paths } from './paths';

@Injectable()
export class SessionService {
  private list_index: any = null;
  private stored_route: any = [''];
  private active_list: any = null;
  private active_doc: any = null;
  private active_doc_data: ArrayBuffer = null;
  private load_init = true;

  constructor(
    private router: Router,
    private annotatorService: AnnotatorService,
    private alveoService: AlveoService,
    private dbService: DBService) {
    this.dbService.get("sessionService").then(
      data => {
        console.log("Stored session data has been found and loaded.");

        this.active_list = data['active_list'];
        this.active_doc = data['active_doc'];
        this.active_doc_data = data['active_doc_data'];
        this.stored_route = data['stored_route'];

        this.prepareDoc();

        this.alveoService.getListDirectory(true, false).subscribe(
          (lists) => {
            this.list_index = lists;
            this.load_init = false;
          },
          (error) => {
            this.load_init = false;
          }
        );
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

  public reset() {
    this.list_index = null;
    this.stored_route = [''];
    this.active_list = null;
    this.active_doc = null;
    this.active_doc_data = null;
  }

  public updateStorage(): Promise<any> {
    return this.dbService.put("sessionService", {
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

  public navigateToStoredRoute(): Promise<any> {
    return this.navigate(this.stored_route);
  }

  public resetSession(url: string) {
    this.onReady().subscribe(
      () => this.router.navigate([url])
    );
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
    this.prepareDoc();
  }

  /* TMP */
  private prepareDoc() {
    this.annotatorService.audioFile = this.active_doc_data;
    this.annotatorService.rebase([]);
    if (this.active_doc != null) {
      this.annotatorService.audioFileName = this.active_doc['dcterms:identifier'];
      this.annotatorService.audioFileURL = this.active_doc['alveo:url'];
    }
    this.annotatorService.setBackUrl(['lists/view']);
  }

  public getActiveDoc(): any {
    return this.active_doc;
  }

  public getActiveDocData(): any {
    return this.active_doc_data;
  }
}
