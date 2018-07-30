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

  public listRemoteStorage(key: string= null, user: number= null): Promise<any> {
    let key_query = "";
    if (key != null) {
      key_query = key
    }

    let user_query = "";
    if (user != null) {
      user_query = "?user_id="+user.toString();
    }

    return this.http.get(
      this.atsPaths.mainUrl
      + this.atsPaths.listSuffix
      + key_query
      + user_query,
      {
        'responseType': 'json'
      }
    ).toPromise();
  }

  public getRemoteStorage(remote_id: string, revision: number= null): Promise<any> {
    let path = this.atsPaths.mainUrl +
      this.atsPaths.objectGetSuffix +
      remote_id;

    if (revision != null) {
      path += '/' + revision.toString();
    }

    return this.http.get(
      path,
      {
        'responseType': 'json'
      }
    ).toPromise();
  }

  public pushRemoteStorage(key: string, data: string, storage_spec: string): Promise<any> {
    return this.http.post(
      this.atsPaths.mainUrl
      + this.atsPaths.objectPostSuffix,
      { 
        key: key,
        value: data,
        storage_spec: storage_spec
      },
      {
        'responseType': 'json'
      }
    ).toPromise();
  }
}
