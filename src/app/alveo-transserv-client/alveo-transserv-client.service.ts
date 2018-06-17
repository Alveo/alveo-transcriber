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

  public listRemoteStorage(): Promise<any> {
    return this.http.get(
      this.atsPaths.mainUrl
      + this.atsPaths.listSuffix,
      {
        'responseType': 'json'
      }
    ).toPromise();
  }

  public listRemoteStorageByKey(key: string): Promise<any> {
    return this.http.get(
      this.atsPaths.mainUrl
      + this.atsPaths.listSuffix
      + key,
      {
        'responseType': 'json'
      }
    ).toPromise();
  }

  public getRemoteStorage(key: string): Promise<any> {
    return this.http.get(
      this.atsPaths.mainUrl
      + this.atsPaths.storageSuffix
      + '?store_id=' + key,
      {
        'responseType': 'json'
      }
    ).toPromise();
  }

  public pushRemoteStorage(key: string, data: any): Promise<any> {
    return this.http.post(
      this.atsPaths.mainUrl
      + this.atsPaths.storageSuffix
      + '?store_id=' + key,
      { 
        key: key,
        value: data
      },
      {
        'responseType': 'json'
      }
    ).toPromise();
  }
}
