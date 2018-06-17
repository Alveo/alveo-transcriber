import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class AlveoTransServClientService  {
  private atsPaths = environment.alveoTranscriberServices.paths;
  private atsAuthDomain = environment.alveoTranscriberServices.auth;

  private apiKey: string= null;

  constructor(private http: HttpClient) {
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getApiUrl(): string {
    return this.atsPaths.mainUrl;
  }

  public getApiAuthDomain(): string {
    return this.atsAuthDomain;
  }

  public setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  public unregister() {
    this.apiKey = null;
  }

  public autosegment(path): Promise<any> {
    return this.http.get(
      this.atsPaths.mainUrl
      + this.atsPaths.segmenterSuffix
      + '?remote_url=' + path,
      {
        'responseType': 'json'
      }
    ).toPromise();
  }
}
