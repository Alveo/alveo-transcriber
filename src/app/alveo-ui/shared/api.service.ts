import { Inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {
  constructor(@Inject('JsAlveo') public jsAlveo: any) {
    this.jsAlveo.apiUrl = environment.alveoPaths.mainUrl;
  }

  public oAuthenticate(
    clientID: string,
    clientSecret: string,
    authCode: string,
    callbackUrl: string): Promise<any> {
    return this.jsAlveo.oAuthenticate(clientID, clientSecret, authCode, callbackUrl);
  }

  public getItem(item_id: string, useCache: boolean= true, useApi: boolean= true): Promise<any> {
    return this.jsAlveo.getItem(item_id, useCache, useApi);
  }

  public getList(list_id: string, useCache: boolean= true, useApi: boolean= true): Promise<any> {
    return this.jsAlveo.getList(list_id, useCache, useApi);
  }

  public getAudioFile(item_id: string, doc_id: string, useCache: boolean= true, useApi: boolean= true): Promise<any> {
    return this.jsAlveo.getDocument(item_id, doc_id, useApi, useCache);
  }

  public getListDirectory(useCache: boolean= true, useApi: boolean= true): Promise<any> {
    return this.jsAlveo.getListDirectory(useCache, useApi);
  }

  public purgeCache(): Promise<any> {
    return this.jsAlveo.purgeCache();
  }

  public purgeCacheByKey(key: string): Promise<any> {
    return this.jsAlveo.purgeCache(key);
  }

  public getApiKey(): string {
    return this.jsAlveo.apiClient.apiKey;
  }

  public unauthorize() {
    this.jsAlveo.unregister();
  }
}
