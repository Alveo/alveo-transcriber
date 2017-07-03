import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MonitorService {
  private onlineStatus$: boolean = navigator.onLine;
  constructor() {
    window.addEventListener('online', () => {this.onlineStatus$ = true});
    window.addEventListener('offline', () => {this.onlineStatus$ = false});
  };

  online(): boolean {
    return this.onlineStatus$;
  }
};
