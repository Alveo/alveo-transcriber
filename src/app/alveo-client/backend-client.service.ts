import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class BackendClientService {
  private alveoPaths = environment.alveoPaths;

  constructor(private http: HttpClient) {
  }

  /* Fetch directory of lists from Alveo API
   *  Expects JSON back from subscribe
   */
  public getListIndex(): Observable<any> {
    return this.http.get(
      this.alveoPaths.mainUrl + '/' + this.alveoPaths.listSuffix,
      {
        'responseType': 'application/json'
      }
    );
  }

  /* Fetch list from Alveo API
   *  Expects JSON back from subscribe
   */
  public getList(id: string): Observable<any> {
    return this.http.get(
      this.alveoPaths.mainUrl + '/' + this.alveoPaths.listSuffix + '/' + id,
      {
        'responseType': 'application/json'
      }
    );
  }

  /* Fetch list item from Alveo API
   *  Expects JSON response
   */
  public getItem(itemId: string): Observable<any> {
    return this.http.get(
      this.alveoPaths.mainUrl + '/' + this.alveoPaths.itemSuffix + '/' + itemId,
      {
        'responseType': 'application/json'
      }
    );
  }

  /* Use an Alveo URL directly
   *  Expects JSON response
   *
   * Used for unsupported routes
   */
  public getResource(url: string): Observable<any> {
    url = url.replace(/^.*\/\/[^\/]+/, '');

    return this.http.get(
      this.alveoPaths.mainUrl + '/' + url,
      {
        'responseType': 'application/json'
      }
    );
  }

  /* Fetch document via Alveo API
  *  Expects ArrayBuffer back from subscribe
  */
  public getDocument(itemId: string, documentId: string): Observable<any> {
    return this.http.get(
      this.alveoPaths.mainUrl + '/' + this.alveoPaths.itemSuffix + '/' + itemId + '/document/' + documentId,
      {
        'responseType': 'arraybuffer'
      }
    );
  }

  /* Create a request to get an OAuth token
   *  These variables are obtained by the Auth service
   */
  public getOAuthToken(clientID: string, clientSecret: string, authCode: string, callbackUrl: string): Observable<any> {
    return this.http.post(
      this.alveoPaths.mainUrl + '/' + this.alveoPaths.oAuthTokenSuffix,
      {
        'grant_type': 'authorization_code',
        'client_id': clientID,
        'client_secret': clientSecret,
        'code': authCode,
        'redirect_uri': callbackUrl
      },
      {
        'responseType': 'application/json'
      }
    );
  }

  /* Create a request to get an API key
   *  Uses token retrievable by getOAuthToken()
   */
  public getApiKey(token: string): Observable<any> {
    return this.http.get(
      this.alveoPaths.mainUrl + '/' + this.alveoPaths.apiKeySuffix,
      {
        'headers': new HttpHeaders(
            {
              'Authorization': 'Bearer ' + token
            }
          ),
        'responseType': 'application/json'
      }
    );
  }

  public getUserDetails(): Observable<any> {
    return this.http.get(this.alveoPaths.mainUrl + '/' + this.alveoPaths.userDetails);
  }
}
