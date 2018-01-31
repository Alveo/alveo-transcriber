import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class SegmentorService {
  segmentorUrl: string = environment.segmentorURL;

  constructor(
    private http: HttpClient
  ) { }

  segment(path: string, callback= null): any {
    this.http.get(this.segmentorUrl + '?url=' + path)
            .subscribe(data => callback(data));
  }
}
