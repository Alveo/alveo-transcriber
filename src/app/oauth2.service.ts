import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { AuthInterface } from './auth.interface'

@Injectable()
export class OAuth2Service implements AuthInterface {
  loggedIn = false;
  redirectLoginUrl = '/login';

  appID: string; // was clientId
  redirectURI: string;
  secret: string; // was dummyClientSecret

  loginURL: string;
  logoutURL: string;
  validateURL: string;
  apiURL: string;
  state: string;
  scope: string;

  key: string;

  constructor(http: Http) {
    this.redirectURI  = window.location.origin + "/oauth/callback";

    this.appID = "b1692ca827a959f62a9b79e0eb471c9fdc3e818c33c976076f7948101ba23084";
    //this.secret = "";

    this.scope = "";

    var baseURL;
    baseURL = "http://staging.alveo.edu.au/";
    this.loginURL = baseURL+"oauth/authorize";
    this.validateURL = baseURL+"oauth/token/info";
    //this.apiURL = baseURL+"account/get_details";
    this.apiURL = baseURL+"api/account_api_key";
    this.logoutURL = "";

    this.state = "";

    this.key = "";
  }

  createLoginURL(state) {
    var url = this.loginURL
                + "?response_type=code"
                + "&client_id="
                + encodeURIComponent(this.appID)
                + "&state="
                + encodeURIComponent(state)
                + "&redirect_uri="
                + encodeURIComponent(this.redirectURI)
                + "&scope="
                + encodeURIComponent(this.scope);

    return url;
  };


  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  initiateLogin(): void {
    location.href = this.createLoginURL('');
  }

  registerToken(token: any) {
    this.key = token;
  }

  login(): void {
    this.loggedIn = true;
    
    // works - retrieves config in form of JSON, no API key
    // location.href = this.apiURL
    

  }

  initiateLogout(): void {
    this.logout();
  }

  logout(): void {
    this.loggedIn = false;
  }
}
