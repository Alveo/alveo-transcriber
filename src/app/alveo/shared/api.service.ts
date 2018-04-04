import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
}
from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {
  private alveoPaths = environment.alveoPaths;

  constructor(private http: HttpClient) {}

  /* Create a get request to Alveo API
   */
  private apiGet(url: string, headers: any= null): Observable<any> {
    return new Observable((observer) =>
      {
        if (headers === null) {
          headers = new HttpHeaders()
        }
        this.http.get(url, headers).subscribe(
          data => {observer.next(data); observer.complete()},
          error => {observer.error(error)}
        )
      }
    );
  }

  /* Create a get request to Alveo API
   */
  private apiPost(url: string, data: any, headers: any= null): Observable<any> {
    return new Observable((observer) =>
      {
        if (headers === null) {
          headers = new HttpHeaders()
        }
        this.http.post(url, data, headers).subscribe(
          data => {observer.next(data); observer.complete()},
          error => {observer.error(error)}
        )
      }
    );
  }

  /* Clean a URL sent from a provider
   *  To prevent MITM hijacking, this will strip the domain from
   *  Alveo URLs. Alveo URLs are their own identifiers, and there is
   *  currently not another alternative, so we will re-add the client-side
   *  expected domain for each request.
   */
  private cleanUrl(url: string): string {
    return url.replace(/^.*\/\/[^\/]+/, '');
  }

  /* Fetch directory of lists from Alveo API
   *  Expects JSON back from subscribe
   */
  public getListIndex(): Observable<any> {
    return this.apiGet(this.alveoPaths.mainUrl + '/' + this.alveoPaths.listSuffix);
  }

  /* Fetch list from Alveo API
   *  Expects JSON back from subscribe
   */
  public getList(id: string): Observable<any> {
    return this.apiGet(this.alveoPaths.mainUrl + '/' + this.alveoPaths.listSuffix + '/' + this.cleanUrl(id));
  }

  /* Fetch list item from Alveo API
   *  Expects JSON back from subscribe
   */
  public getItem(itemId: string): Observable<any> {
    return this.apiGet(this.alveoPaths.mainUrl + '/' + this.alveoPaths.itemSuffix + '/' + this.cleanUrl(itemId));
  }

  /* Fetch document via Alveo API
   *  Expects ArrayBuffer back from subscribe
   */
  public getDocument(itemId: string, documentId: string): Observable<any> {
    // TODO
    return this.apiGet(this.alveoPaths.mainUrl + '/' + this.alveoPaths.itemSuffix + '/' + this.cleanUrl(itemId) + '/document/' + documentId,
      {'responseType': 'arraybuffer'});
  }


  /* Create a request to get an OAuth token
   *  These variables are obtained by the Auth service
   */
  public getOAuthToken(clientID: string, clientSecret: string, authCode: string, callbackUrl: string): Observable<any> {
    return this.apiPost(this.alveoPaths.mainUrl + '/' + this.alveoPaths.oAuthTokenSuffix,
      {
        'grant_type': 'authorization_code',
        'client_id': clientID,
        'client_secret': clientSecret,
        'code': authCode,
        'redirect_uri': callbackUrl
      }
    );
  }

  /* Create a request to get an API key
   *  Uses token retrievable by getOAuthToken()
   */
  public getApiKey(token: string): Observable<any> {
    const requestHeaders = {
      headers: new HttpHeaders(
        {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }),
    };

    return this.apiGet(this.alveoPaths.mainUrl + '/' + this.alveoPaths.apiKeySuffix, requestHeaders)
  }
}
