import { Inject, Injectable } from '@angular/core';

import { ApiService } from './api.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class SegmentorService {
  constructor(
    @Inject('TranscriberServices') public alveots: any,
    private apiService: ApiService) {
    this.alveots.apiUrl = environment.alveoTranscriberServices.paths.mainUrl;
    this.alveots.apiAuth = environment.alveoTranscriberServices.auth;
  }

  public segment(path: string): Promise<any> {
    this.alveots.apiKey = this.apiService.getApiKey();
    return this.alveots.segment(path);
  }
}
