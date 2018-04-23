import { Injectable } from '@angular/core';
import { TranscriberServices } from '@alveo-vl/jsalveo';

import { environment } from '../../../environments/environment';

@Injectable()
export class SegmentorService {
  private alveots: TranscriberServices;

  constructor() {
    this.alveots = new TranscriberServices({
      apiUrl: environment.segmenterUrl
    });
  }

  public segment(path: string): Promise<any> {
    return this.alveots.segment(path);
  }
}
