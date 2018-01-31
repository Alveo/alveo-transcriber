import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/Observable';

import { DBService, Databases } from './db.service';
import { AlveoService } from './alveo.service';

import { Paths } from './paths';

@Injectable()
export class SessionService {
  private stored_route: any = [''];
  private loading: any = [];

  constructor(
    private router: Router,
    private alveoService: AlveoService,
    private dbService: DBService) {

    this.annotationEventSubscribe();
    this.loading.push('dbservice');
    this.dbService.instance(Databases.Cache).get('sessionService').then(
      data => {
        console.log('Stored session data has been found and loaded.');

        this.stored_route = data['stored_route'];

        this.loading.pop(this.loading.filter(inst => inst === 'dbservice'));
      },
      error => {
        console.log('Stored session data not found. Initialising.');

        this.updateStorage();

        this.loading.pop(this.loading.filter(inst => inst === 'dbservice'));
      }
    );
  }

  private annotationEventSubscribe() {
    /* TODO
    this.annotationsService.serviceEvent.subscribe(
      (event) => {
        if (event === 'exit') {
          this.navigate([Paths.ListView]);
        }
      }
    );
     */
  }

  public isLoading(): boolean {
    if (this.loading.length > 0) {
      return true;
    }
    return false;
  }

  public onReady(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        const interval = setInterval(() => {
          if (this.loading.length === 0) {
            clearInterval(interval);
            resolve();
          }
        }, 5);
      }
    );
  }

  public reset() {
    this.stored_route = [''];
  }

  public updateStorage(): Promise<any> {
    return this.dbService.instance(Databases.Cache).put('sessionService', {
      'stored_route': this.stored_route,
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

  public shortenItemUrl(item_url: string): string {
    return item_url.split('/item_lists/')[1];
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

  public refreshSession(url= null) {
    this.onReady().then(
      () => {
        if (url === null) {
          url = Paths.Index;
        }

        this.router.navigate([url])
      }
    );
  }
}
