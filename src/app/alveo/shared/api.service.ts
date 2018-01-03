import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { ErrorHandler } from './http-errors'

import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {
  alveoUrl: string = environment.baseURL;

  constructor(private http: HttpClient) {}

  /* Fetch directory of lists from Alveo API 
   *  Expects JSON back from subscribe
   */
  public getListIndex(): Observable<any> {
    return this.http.get(this.alveoUrl + '/item_lists');
  }

  /* Fetch list from Alveo API
   *  Expects JSON back from subscribe
   */
  public getList(listId: string): Observable<any> {
    return this.http.get(this.alveoUrl + '/' + listId);
  }

  /* Fetch list item from Alveo API
   *  Expects JSON back from subscribe
   */
  public getItem(itemId: string): Observable<any> {
    return this.http.get(this.alveoUrl + '/' + itemId);
  }

  /* Fetch document via Alveo API
   *  Expects ArrayBuffer back from subscribe
   */
  public getDocument(documentId: string): Observable<any> {
    return this.http.get(this.alveoUrl + '/' + documentId,
      {'responseType': 'arraybuffer'});
  }
}
