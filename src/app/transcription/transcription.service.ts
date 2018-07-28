import { Injectable } from '@angular/core';

import { BrowserCacheDatabase } from '../browser-cache/browser-cache.module';

import { Transcription } from './transcription';

/* Service for handling the database interaction for Transcriptions */
@Injectable()
export class TranscriptionService {
  private database: BrowserCacheDatabase;

  constructor() {
    this.database = new BrowserCacheDatabase('transcription-service');
  }

  public destroyData(): Promise<any> {
    return this.database.rebuild();
  }

  public loadTranscription(identifier: string): Promise<any> {
    return this.database.get(identifier);
  }

  public saveTranscription(identifier: string, transcription: Transcription): Promise<any> {
    return this.database.put(identifier, transcription);
  }
}
