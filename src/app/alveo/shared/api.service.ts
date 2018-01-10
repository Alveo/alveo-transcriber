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
  alveoUrl: string = environment.baseURL;
  loginURL: string = environment.loginURL;

  constructor(private http: HttpClient) {}

  /* Log API errors
   *  All API errors should be prevented at higher level
   */
  private ErrorHandler(error: HttpErrorResponse) {
    console.log(
      'Alveo API Error (' + error.status.toString() + '): ' + error.message
    );
  }

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
          error => {this.ErrorHandler(error); observer.error(error)}
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
          error => {this.ErrorHandler(error); observer.error(error)}
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
  private cleanUrl(alveoUrl): string {
    return alveoUrl.replace(/^.*\/\/[^\/]+/, '');
  }

  /* Fetch directory of lists from Alveo API 
   *  Expects JSON back from subscribe
   */
  public getListIndex(): Observable<any> {
    return this.apiGet(this.alveoUrl + '/item_lists');
  }

  /* Fetch list from Alveo API
   *  Expects JSON back from subscribe
   */
  public getList(listId: string): Observable<any> {
    return this.apiGet(this.alveoUrl + '/' + this.cleanUrl(listId));
  }

  /* Fetch list item from Alveo API
   *  Expects JSON back from subscribe
   */
  public getItem(itemId: string): Observable<any> {
    return this.apiGet(this.alveoUrl + '/' + this.cleanUrl(itemId));
  }

  /* Fetch document via Alveo API
   *  Expects ArrayBuffer back from subscribe
   */
  public getDocument(documentId: string): Observable<any> {
    return this.apiGet(this.alveoUrl + '/' + this.cleanUrl(documentId),
      {'responseType': 'arraybuffer'});
  }


  /* Create a request to get an OAuth token
   *  These variables are obtained by the Auth service
   */
  public getOAuthToken(clientID: string, clientSecret: string, authCode: string, callbackUrl: string): Observable<any> {
    return this.apiPost(this.alveoUrl + '/oauth/token',
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

    return this.apiGet(this.alveoUrl + '/account_api_key', requestHeaders)
  }
}
