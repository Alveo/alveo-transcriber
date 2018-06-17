import { Injectable } from '@angular/core';

@Injectable()
export class OnlineStatusService {
  private onlineStatus$: boolean = navigator.onLine;
  constructor() {
    window.addEventListener('online', () => {this.onlineStatus$ = true; });
    window.addEventListener('offline', () => {this.onlineStatus$ = false; });
  }

  isOnline(): boolean {
    return this.onlineStatus$;
  }
}
