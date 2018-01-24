import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/Observable';

import { DBService, Databases } from './db.service';
import { AlveoService } from './alveo.service';
import { AnnotationsService } from './annotations.service';

import { Paths } from './paths';

@Injectable()
export class SessionService {
  private list_index: any = null;
  private stored_route: any = [''];
  private active_list: any = null;
  private active_doc: any = null;
  private active_doc_data: ArrayBuffer = null;
  private loading: any = [];

  constructor(
    private router: Router,
    private alveoService: AlveoService,
    private annotationsService: AnnotationsService,
    private dbService: DBService) {
    this.annotationEventSubscribe();
    this.loading.push("dbinstance");
    this.dbService.instance(Databases.Cache).get("sessionService").then(
      data => {
        console.log("Stored session data has been found and loaded.");

        this.active_list = data['active_list'];
        this.active_doc = data['active_doc'];
        this.active_doc_data = data['active_doc_data'];
        this.stored_route = data['stored_route'];

        if (this.active_doc !== null) {
          this.loading.push("annotatorprep");
          this.annotationsService.setFileUrl(this.active_doc['alveo:url']);
          this.annotationsService.prepareAnnotator(
            this.active_doc['dcterms:identifier'],
            this.active_doc_data).then(
              () => {
                this.loading.pop(this.loading.filter(inst => inst === "annotatorprep"));
              }
            );
        }

        this.alveoService.getListDirectory(true, false).subscribe(
          (lists) => {
            this.list_index = lists;
            this.loading.pop(this.loading.filter(inst => inst === "dbservice"));
          },
          (error) => {
            this.loading.pop(this.loading.filter(inst => inst === "dbservice"));
          }
        );
      },
      error => {
        console.log("Stored session data not found. Initialising.");

        this.updateStorage();

        this.loading.pop(this.loading.filter(inst => inst === "dbservice"));
      }
    );
  }

  private annotationEventSubscribe() {
    this.annotationsService.serviceEvent.subscribe(
      (event) => {
        if (event === 'exit') {
          this.navigate([Paths.ListView]);
        }
      }
    );
  }

  public isLoading(): boolean {
    if (this.loading.length > 0) {
      return true;
    }
    return false;
  }

  public onReady(): Observable<any> {
    return new Observable(
      (observer) => {
        let interval = setInterval(() => {
          if (this.loading.length === 0) {
            clearInterval(interval);
            observer.next();
            observer.complete();
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
    return this.dbService.instance(Databases.Cache).put("sessionService", {
      "stored_route": this.stored_route,
      "active_list": this.active_list,
      "active_doc": this.active_doc,
      "active_doc_data": this.active_doc_data,
    });
  }

  private dbRequest(storageName: string): Observable<any> {
    return new Observable((observer) =>
      {
        this.dbService.instance(Databases.Cache).get(storageName).then(
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

  public refreshSession(url=null) {
    this.onReady().subscribe(
      () => {
        if (url === null) {
          url = Paths.Index;
        }

        this.router.navigate([url])
      }
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

  public setActiveDoc(doc: any, docData: ArrayBuffer): Promise<any> {
    this.active_doc = doc;
    this.active_doc_data = docData;
    this.updateStorage();

    this.annotationsService.setFileUrl(this.active_doc['alveo:url']);
    return this.annotationsService.prepareAnnotator(
      doc['dcterms:identifier'],
      docData
    );
  }

  public getActiveDoc(): any {
    return this.active_doc;
  }

  public getActiveDocData(): any {
    return this.active_doc_data;
  }
}
