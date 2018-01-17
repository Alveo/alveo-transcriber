import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { DBService } from './db.service';

@Injectable()
export class SessionService {
  private active_route: any = [];
  private active_list: any = null;
  private active_doc: any = null;
  private active_doc_data: ArrayBuffer = null;
  private load_init = true;

  constructor(
    private router: Router,
    private dbService: DBService) {
    this.dbService.get("sessionService").then(
      data => {
        console.log("Stored session data has been found and loaded.");

        this.active_list = data['active_list'];
        this.active_doc = data['active_doc'];
        this.active_doc_data = data['active_doc_data'];

        this.load_init = false;

        this.navigate(data['active_route']).subscribe();
      },
      error => {
        console.log("Stored session data not found. Initialising.");

        this.updateStorage();

        this.load_init = false;
      }
    );
  }

  private updateStorage() {
    this.dbService.put("sessionService", {
      "active_route": this.active_route,
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
  public navigate(route: any[]): Observable<any> {
    return new Observable((observer) => {
      this.router.navigate(route)
        .then(data => {
          this.active_route = route;
          this.updateStorage();
          observer.next(data);
          observer.complete();
        })
        .catch(error =>  {
          observer.error(error);
        })
    });
  }

  public resetSession() {
    this.navigate(['/']).subscribe();

    if (!this.load_init) {
      this.setActiveList(null);
      this.setActiveDoc(null, null);
    }
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
  }

  public getActiveDoc(): any {
    return this.active_doc;
  }

  public getActiveDocData(): any {
    return this.active_doc_data;
  }
}
