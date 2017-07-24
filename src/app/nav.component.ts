import { Component } from '@angular/core';
import { AppUtilService } from './app-util.service';

@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})

export class NavComponent {
  constructor(public appService: AppUtilService) { }

  queryLoggedIn(): boolean {
    return this.appService.auth.isLoggedIn();
  }

  actionLogout(): void {
    this.appService.auth.initiateLogout();
  }
}
