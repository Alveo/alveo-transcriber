import { Component } from '@angular/core';
import { SessionService } from './session.service';
import { DataService } from './data.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'session',
  template: '',
})

export class SessionComponent implements OnInit {
  constructor(private sessionService: SessionService, 
              private dataService: DataService) { }
  ngOnInit(): void {
    this.dataService.pullData();
    //this.sessionService.login();
  }
}
