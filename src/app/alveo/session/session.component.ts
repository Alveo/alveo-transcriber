import { Component, OnInit } from '@angular/core';

import { SessionService } from '../shared/session.service';

@Component({
  selector: 'session',
  templateUrl: './session.component.html',
})

export class SessionComponent implements OnInit {
  constructor(
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.sessionService.onReady().subscribe(
      () => {
        //console.log("Load finished");
        this.sessionService.navigate(['api/select']);
        // If we came from OAuth, call OAuth redirect
      }
    );
  }
}
