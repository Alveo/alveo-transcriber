import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { SessionService } from '../shared/session.service';

/* Component for displaying a login dialogue
 *  Ideally should be injected in from a service, rather than direct use via a template. */
@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    private sessionService: SessionService,
  ) { }

  public isFirstRun(): boolean {
    return this.data['firstRun'];
  }

  public async actionLogin(): void {
    let callbackRoute = this.data['callbackRoute'];
    if (callbackRoute == null) {
      callbackRoute = [window.location.pathname];
    }
    await this.sessionService.setCallbackRoute(callbackRoute);
    location.href = this.data['loginUrl'];
  }
}
