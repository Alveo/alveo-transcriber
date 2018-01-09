import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  loginStatus: EventEmitter<any> = new EventEmitter();

  loggedIn = false;
  redirectLoginUrl = '/login';

  loginURL: string = environment.baseURL + environment.loginURL;

  clientID: string = environment.clientID;
  clientSecret: string = environment.clientSecret;
  callbackUrl: string = environment.callbackURL;

  authCode: string; // oAuth
  apiKey: string = "";

  constructor(private apiService: ApiService) {}

  createLoginURL() {
    return this.loginURL
          + '?response_type=code'
          + '&client_id='     + encodeURIComponent(this.clientID)
          + '&state='         + encodeURIComponent('')
          + '&redirect_uri='  + encodeURIComponent(this.callbackUrl)
          + '&scope='         + encodeURIComponent('');
  };

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  isApiAuthed(): boolean {
    return (this.apiKey.length > 0);
  }

  initiateLogin(): void {
    location.href = this.createLoginURL();
  }

  login(): void {
    this.loginStatus.emit('true');
    this.loggedIn = true;
    this.authoriseApi();
  }

  initiateLogout(): void {
    this.logout();
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
