import { Injectable } from '@angular/core';
import { JsAlveo } from '@alveo-vl/jsalveo';

import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {
  public jsAlveo: JsAlveo;

  constructor() {
    this.jsAlveo = new JsAlveo(
      {
        apiUrl: environment.alveoPaths.mainUrl
      }
    );
  }
}
