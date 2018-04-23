import { Injectable } from '@angular/core';
import { JsAlveo } from '@alveo-vl/jsalveo';

import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {
  private jsAlveo: JsAlveo;

  constructor() {
    this.jsAlveo = new JsAlveo(
      {
        apiUrl: environment.alveoPaths.mainUrl
      }
    );
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
    // TODO should be getDocument.
    //  getAudioFile is likely only applicable to the transcriber
    return this.jsAlveo.getAudioFile(item_id, doc_id, useApi, useCache);
  }

  public getListDirectory(useCache: boolean= true, useApi: boolean= true): Promise<any> {
    return this.jsAlveo.getListDirectory(useCache, useApi);
  }

  public purgeCache(): Promise<any> {
    return this.jsAlveo.purgeCache();
  }
}
