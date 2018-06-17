import { Inject, Injectable } from '@angular/core';

import { AlveoClientService } from '../../alveo-client/alveo-client.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class SegmentorService {
  constructor(
    @Inject('TranscriberServices') public alveots: any,
    private alveoClientService: AlveoClientService) {
    this.alveots.apiUrl = environment.alveoTranscriberServices.paths.mainUrl;
    this.alveots.apiAuth = environment.alveoTranscriberServices.auth;
  }

  public segment(path: string): Promise<any> {
    this.alveots.apiKey = this.alveoClientService.getApiKey();
    return this.alveots.segment(path);
  }
}
