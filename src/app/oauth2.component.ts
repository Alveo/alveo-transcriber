import { Component } from '@angular/core';
import { AppUtilService } from './app-util.service';

@Component({
  selector: 'oauth2',
  templateUrl: './oauth2.component.html',
  styleUrls: ['./oauth2.component.css'],
})

export class OAuth2Component {
  constructor(public appService: AppUtilService) { }

  actionLogin(): void {
    this.appService.auth.initiateLogin();
  }
}
