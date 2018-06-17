import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { ErrorNotifyComponent } from '../error-notify/error-notify.component';

import { BrowserCacheDatabase } from '../../browser-cache/browser-cache.database';
import { Paths } from './paths';

@Injectable()
export class SessionService {
  private stored_route: any = [''];
  private ready = false;
  private activeErrorRef: any = null;
  private database: BrowserCacheDatabase;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router) {
    this.database = new BrowserCacheDatabase("session-service");
    this.loadSession();
  }

  public async purge(): Promise<any> {
    await this.database.rebuild();
    this.reset();
    await this.updateStorage();
  }

  private async loadSession(): Promise<any> {
    try {
      const data = await this.database.get('sessionService');
      console.log('Stored session data has been found and loaded.');

      this.stored_route = data['stored_route'];
    } catch(error) {
      console.log('Stored session data not found. Initialising.');
      await this.updateStorage();
    }
    this.ready = true;
  }

  public async onReady(): Promise<any> {
    const interval = setInterval(() => {
      if (this.ready) {
        clearInterval(interval);
        Promise.resolve();
      }
    }, 5);
  }

  public reset() {
    this.stored_route = [''];
  }

  public setCallbackRoute(route: any): Promise<any> {
    this.stored_route = route;
    return this.updateStorage();
  }

  public updateStorage(): Promise<any> {
    return this.database.put('sessionService', {
      'stored_route': this.stored_route,
    });
  }

  private async dbRequest(storageName: string): Promise<any> {
    return this.database.get(storageName);
  }

  public shortenItemUrl(item_url: string): string {
    return item_url.split('/item_lists/')[1];
  }

  /* Navigate to the specified route if possible */
  public async navigate(route: any[]): Promise<any> {
    let data = await this.router.navigate(route);

    if (this.activeErrorRef !== null) {
      this.activeErrorRef.dismiss();
      this.activeErrorRef = null;
    }
  }

  public navigateToStoredRoute(): Promise<any> {
    return this.navigate(this.stored_route);
  }

  public async refreshSession(url= null) {
    await this.onReady();

    if (url === null) {
      url = Paths.Index;
    }

    this.router.navigate([url]);
  }

  public displayError(errorMessage: string, consoleError: any, duration: number= 0) {
    console.log(consoleError);
    this.activeErrorRef = this.snackBar.openFromComponent(ErrorNotifyComponent, {
      'data': {
        'message': errorMessage
      },
      'duration': duration
    });
    this.activeErrorRef.instance.snackBarRef = this.activeErrorRef;
  }
}
