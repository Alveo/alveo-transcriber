import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { DBService } from './db.service';

@Injectable()
export class SessionService {
  private active_route: any[];
  private selected_list: any = null;
  private selected_doc: any = null;
  private selected_doc_data: ArrayBuffer = null;

  constructor(
    private router: Router,
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
          observer.next(data);
          observer.complete();
        })
        .catch(error =>  {
          observer.error(error);
        })
    });
  }

  public resetSession() {
    this.setActiveList(null);
    this.setActiveDoc(null, null);
    this.navigate(['/']).subscribe();
  }

  public setActiveList(list: any) {
    this.selected_list = list;
  }

  public getActiveList(): any {
    return this.selected_list;
  }

  public setActiveDoc(doc: any, docData: ArrayBuffer) {
    this.selected_doc = doc;
    this.selected_doc_data = docData;
  }

  public getActiveDoc(): any {
    return this.selected_doc;
  }

  public getActiveDocData(): any {
    return this.selected_doc_data;
  }
}
