import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class SegmentorService {
  segmentorUrl: string = environment.segmentorURL;

  constructor(
    private http: Http
  ) {}

  segment(path: string, callback= null): any {
    this.http.get(this.segmentorUrl + '?url=' + path)
            .subscribe(data => callback(data));
  }
}
