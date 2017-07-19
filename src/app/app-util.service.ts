import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { OAuth2Service } from './oauth2.service';
import { DataService } from './data.service';
import { MonitorService } from './monitor.service';
import { PlayerControlService } from './player-control.service';
import { DBService } from './db.service';
import { AudioService } from './audio.service';

@Injectable()
export class AppUtilService {
  auth: OAuth2Service;
  data: DataService;
  database: DBService;;
  monitor: MonitorService;
  audioPlayer: PlayerControlService;
  audioService: AudioService;

  constructor(http: Http) {
    this.auth = new OAuth2Service();
    this.database = new DBService();
    this.data = new DataService(http, this);
    this.monitor = new MonitorService();
    this.audioPlayer = new PlayerControlService();
    this.audioService = new AudioService(http);
  }
}
