import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';

import { ErrorHandler } from './http-errors'

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  loginStatus:EventEmitter<any> = new EventEmitter();

  loggedIn = false;
  redirectLoginUrl = '/login';

  baseURL: string = environment.baseURL;
  loginURL: string = environment.loginURL;

  clientID: string = environment.clientID;
  clientSecret: string = environment.clientSecret;
  callbackURL: string = environment.callbackURL;

  authCode: string;
  token: string;

  state: string = '';
  scope: string = '';

  apiKey: string;

  constructor(private http: Http) { }

  createLoginURL() {
    return this.loginURL
          + "?response_type=code"
          + "&client_id="     +encodeURIComponent(this.clientID)
          + "&state="         +encodeURIComponent(this.state)
          + "&redirect_uri="  +encodeURIComponent(this.callbackURL)
          + "&scope="         +encodeURIComponent(this.scope);
  };

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  initiateLogin(): void {
    location.href = this.createLoginURL();
  }

  login(callback: any): void {
    this.loginStatus.emit("true");
    this.pullToken();
    this.loggedIn = true;
    callback();
  }

  initiateLogout(): void {
    this.logout();
  }

  logout(): void {
    this.loginStatus.emit("false")
    this.loggedIn = false;
  }

  callback(code: string): void {
    this.authCode = code;
  }

  buildHeader(): Headers {
    return new Headers({
        'Accept': 'application/json'
      });
  }

  buildOptions(headers: Headers): RequestOptions {
    return new RequestOptions({ headers: headers });
  }

  pullToken(): void {
    this.http.post(this.baseURL + '/oauth/token', {
      "grant_type": "authorization_code",
      "client_id": this.clientID,
      "client_secret": this.clientSecret,
      "code": this.authCode,
      "redirect_uri": this.callbackURL
      }, this.buildOptions(this.buildHeader()))
    .subscribe(data => {this.token = data.json().access_token; this.pullAPIKey() },
               error => ErrorHandler(error, this));
  }

  pullAPIKey(): void {
    let header = this.buildHeader();
    header.append('Authorization', "Bearer "+this.token);

    this.http.get(this.baseURL + '/account_api_key', this.buildOptions(header))
    .subscribe(data => this.apiKey = data.json().apiKey,
               error => ErrorHandler(error, this));
  }
}
