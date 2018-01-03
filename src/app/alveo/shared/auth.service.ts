import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ErrorHandler } from './http-errors'

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  loginStatus: EventEmitter<any> = new EventEmitter();

  loggedIn = false;
  redirectLoginUrl = '/login';

  baseURL: string = environment.baseURL;
  loginURL: string = environment.loginURL;

  clientID: string = environment.clientID;
  clientSecret: string = environment.clientSecret;
  callbackURL: string = environment.callbackURL;

  authCode: string;

  state: string;
  scope: string;

  apiKey: string;

  constructor(private http: HttpClient) {
    this.scope = '';
    this.state = '';
    this.apiKey = '';
  }

  createLoginURL() {
    return this.loginURL
          + '?response_type=code'
          + '&client_id='     + encodeURIComponent(this.clientID)
          + '&state='         + encodeURIComponent(this.state)
          + '&redirect_uri='  + encodeURIComponent(this.callbackURL)
          + '&scope='         + encodeURIComponent(this.scope);
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
  }

  callback(code: string): void {
    this.authCode = code;
  }

  authoriseApi(): void {
    this.getAPIAuth().subscribe(
      data => {
        this.getApiKey(data['access_token'])
          .subscribe(
            data => this.apiKey = data['apiKey'],
            error => ErrorHandler(error, this)
          );
      },
      error => ErrorHandler(error, this)
    );
  }

  getAPIAuth(): Observable<any> {
    return this.http.post(this.baseURL + '/oauth/token',
      {
        'grant_type': 'authorization_code',
        'client_id': this.clientID,
        'client_secret': this.clientSecret,
        'code': this.authCode,
        'redirect_uri': this.callbackURL
      },
      {
        headers: new HttpHeaders({ 'Accept': 'application/json'})
      }
    )
  }

  getApiKey(token: string): Observable<any> {
    const requestHeaders = {
      headers: new HttpHeaders(
        {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }),
    };

    return this.http.get(this.baseURL + '/account_api_key', requestHeaders)
  }
}
