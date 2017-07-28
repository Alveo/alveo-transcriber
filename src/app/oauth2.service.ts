import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';

import { ErrorHandler } from './http-errors'

@Injectable()
export class OAuth2Service {
  loggedIn = false;
  redirectLoginUrl = '/login';

  baseURL: string = "https://staging.alveo.edu.au";
  loginURL: string = this.baseURL+"/oauth/authorize";

  clientID: string = "b1692ca827a959f62a9b79e0eb471c9fdc3e818c33c976076f7948101ba23084";
  clientSecret: string = "e533af5728a1334a089d9b446bda3204be4d59785734981832956b446cfbf64b";
  callbackURL: string = window.location.origin+ "/oauth/callback";
  authCode: string;
  token: string;

  state: string = '';
  scope: string = '';

  apiKey: string;

  constructor(public http: Http) { }

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
    this.pullToken();
    this.loggedIn = true;
    callback();
  }

  initiateLogout(): void {
    this.logout();
  }

  logout(): void {
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
