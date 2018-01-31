import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { DBService, Databases } from './db.service';

import { Paths } from './paths';

@Injectable()
export class SessionService {
  private stored_route: any = [''];
  private ready: boolean = false;

  constructor(
    private router: Router,
    private dbService: DBService) {

    this.dbService.instance(Databases.Cache).get('sessionService').then(
      data => {
        console.log('Stored session data has been found and loaded.');

        this.stored_route = data['stored_route'];
        this.ready = true;
      },
      error => {
        console.log('Stored session data not found. Initialising.');

        this.updateStorage().then(
          () => this.ready = true
        );
      }
    );
  }

  public onReady(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        const interval = setInterval(() => {
          if (this.ready) {
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
      (resolve, reject) => {
        this.router.navigate(route).then(
          (data) => {
            this.stored_route = route;
            this.updateStorage().then(
              () => resolve(data)
            );
          })
        .catch(
          (error) => {
            reject(error)
          }
        );
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
