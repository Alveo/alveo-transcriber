import { Injectable } from '@angular/core';

import { OAuth2Service } from './oauth2.service';

@Injectable()
export class AppUtilService {
  auth: OAuth2Service;

  constructor() {
    this.auth = new OAuth2Service();
  }
}
