import { Component } from '@angular/core';
import { SessionService } from './session.service';
import { DataService } from './data.service';
import { OnInit } from '@angular/core';

import { Clip } from './clip';

@Component({
  selector: 'session',
  template: `
  <div *ngIf="this.dataService.blobdata!=undefined">
  <audio controls><source src="data:audio/ogg;base64,{{this.dataService.blobdata}}" type="audio/ogg"></audio>
  </div>
  {{this.dataService.gen64if()}}
  `,
})

export class SessionComponent implements OnInit {

  constructor(private sessionService: SessionService, 
              private dataService: DataService) { }
  ngOnInit(): void {
    this.dataService.getData();
    this.dataService.getFile();
  }

}
