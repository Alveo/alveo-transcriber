import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

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
    private dialog: MatDialog
  ) { }

  isFirstRun(): boolean {
    return this.data['firstRun'];
  }

  actionLogin(): void {
    location.href = this.data['loginUrl'];
  }
}
