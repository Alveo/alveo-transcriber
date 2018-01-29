import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';

import { AuthComponent } from '../auth/auth.component';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  loginStatus: EventEmitter<any> = new EventEmitter();

  loggedIn = false;
  redirectLoginUrl = '/login';

  loginUrl: string = environment.baseURL + environment.loginURL;

  clientID: string = environment.clientID;
  clientSecret: string = environment.clientSecret;
  callbackUrl: string = environment.callbackURL;

  authCode: string; // oAuth
  apiKey = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  private createLoginUrl() {
    return this.loginUrl
          + '?response_type=code'
          + '&client_id='     + encodeURIComponent(this.clientID)
          + '&state='         + encodeURIComponent('')
          + '&redirect_uri='  + encodeURIComponent(this.callbackUrl)
          + '&scope='         + encodeURIComponent('');
  };

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public isApiAuthed(): boolean {
    return (this.apiKey.length > 0);
  }

  public promptLogin(firstRun: boolean= false) {
    setTimeout(() => {
      if (this.dialog.openDialogs.length < 1) {
        this.dialog.open(AuthComponent, {
          disableClose: firstRun,
          data: {
            firstRun: firstRun,
            loginUrl: this.createLoginUrl()
          }
        });
      }
    }, 50);
  }

  login(): void {
    this.loginStatus.emit('true');
    this.loggedIn = true;
    this.authoriseApi();
  }

  logout(): void {
    this.loginStatus.emit('false')
    this.loggedIn = false;
    this.apiKey = '';
  }

  callback(code: string): void {
    this.authCode = code;
  }

  authoriseApi(): void {
    this.apiService.getOAuthToken(
      this.clientID,
      this.clientSecret,
      this.authCode,
      this.callbackUrl,
    ).subscribe(
      data => {
        this.apiService.getApiKey(data['access_token'])
          .subscribe(
            data => {
              this.apiKey = data['apiKey'];
            },
            error => {
              console.log(error);
            }
          );
      },
      error => {
        console.log(error)
      }
    );
  }
}
