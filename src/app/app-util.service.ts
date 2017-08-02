import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http } from '@angular/http';

import { OAuth2Service } from './oauth2.service';
import { AlveoService } from './alveo.service';
import { MonitorService } from './monitor.service';
import { PlayerControlService } from './player-control.service';
import { DBService } from './db.service';

@Injectable()
export class AppUtilService {
  auth: OAuth2Service;
  alveo: AlveoService;
  database: DBService;;
  monitor: MonitorService;
  audioPlayer: PlayerControlService;

  constructor(http: Http, route: ActivatedRoute) {
    this.auth = new OAuth2Service(http);
    this.database = new DBService();
    this.alveo = new AlveoService(http, this);
    this.monitor = new MonitorService();
    this.audioPlayer = new PlayerControlService();
  }
}
