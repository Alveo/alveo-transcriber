import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';

import { AppUtilService } from './app-util.service';
import { Clip } from './clip';

@Injectable()
export class AlveoService {
  selected = null;
  clips = [];
  errorMessage: string;
  lists: any;
  baseURL: string = "https://staging.alveo.edu.au/";
  clientID: string = "b1692ca827a959f62a9b79e0eb471c9fdc3e818c33c976076f7948101ba23084";
  clientSecret: string = "e533af5728a1334a089d9b446bda3204be4d59785734981832956b446cfbf64b";
  callbackURL: string = "https://10.126.109.47:4200/oauth/callback";
  token: string;

  apiKey: string;

  constructor(
    private http: Http,
    public appService: AppUtilService) {}

  buildHeader(): Headers {
    return new Headers({
        'Accept': 'application/json'
      });
  }

  buildOptions(headers: Headers): RequestOptions {
    return new RequestOptions({ headers: headers });
  }

  pullToken(authCode: string): void {
    this.http.post(this.baseURL + 'oauth/token', {
      "grant_type": "authorization_code",
      "client_id": this.clientID,
      "client_secret": this.clientSecret,
      "code": authCode,
      "redirect_uri": this.callbackURL
      }, this.buildOptions(this.buildHeader()))
      .catch(this.handleError)
      .subscribe(data => this.token = data.json().access_token);
  }

  pullAPI(): void {
    let header = this.buildHeader();
    header.append('Authorization', "Bearer "+this.token);

    this.http.get(this.baseURL + 'account_api_key', this.buildOptions(header))
                .catch(this.handleError)
                .subscribe(data => this.apiKey = data.json().apiKey);
  }

  pullLists(): void {
    let header = this.buildHeader();
    header.append('X-Api-Key', this.apiKey);

    this.http.get(this.baseURL + 'item_lists', this.buildOptions(header))
                .catch(this.handleError)
                .subscribe(data => this.lists = data.json().own); //what about cat 'shared'?
  }


  pull(url: string): void {
    this.http.get(url).catch(this.handleError)
                      .subscribe(clips => this.clips = clips);
  }
  
  startStore(): void {
    setInterval(() => {this.appService.database.put("clips", {clips: this.clips})}, 1000);
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
