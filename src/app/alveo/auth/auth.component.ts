import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  isFirstRun(): boolean {
    return this.data.firstRun;
  }

  actionLogin(): void {
    this.authService.initiateLogin();
  }
}
