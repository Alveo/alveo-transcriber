import { Component } from '@angular/core';
import { SessionService } from './session.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'session',
  template: '',
})

export class SessionComponent implements OnInit {
  constructor(private sessionService: SessionService) { }
  ngOnInit(): void {
    this.sessionService.login();
  }
}
