import { Injectable } from '@angular/core';
import { TranscriberServices } from '@alveo-vl/jsalveo';

import { ApiService } from './api.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class SegmentorService {
  private alveots: TranscriberServices;

  constructor(private apiService: ApiService) {
    this.alveots = new TranscriberServices({
      apiUrl: environment.segmenterUrl,
      apiAuth: environment.segmenterAuth
    });
  }

  public segment(path: string): Promise<any> {
    this.alveots.apiKey = this.apiService.getApiKey();
    return this.alveots.segment(path);
  }
}
