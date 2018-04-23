//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class SegmentorService {
  segmentorUrl: string = environment.segmentorURL;

  constructor(
    //private http: HttpClient
  ) { }

  async segment(path: string): Promise<any> {
    //return this.http.get(this.segmentorUrl + '?url=' + path);
  }
}
