import { Component } from '@angular/core';
import { SessionService } from './session.service';
import { DataService } from './data.service';
import { OnInit } from '@angular/core';

import { Clip } from './clip';

@Component({
  selector: 'session',
  template: `
  {{this.dataService.gen64if()}}
  {{this.dataService.genABif()}}
  `,
})

export class SessionComponent implements OnInit {

  constructor(public sessionService: SessionService, 
              public dataService: DataService) { }
  ngOnInit(): void {
    this.dataService.getData();
    this.dataService.getFile();
  }

}
