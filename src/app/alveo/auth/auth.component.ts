import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../shared/auth.service';
import { SessionService } from '../shared/session.service';

import { Paths } from '../shared/paths';

@Component({
  selector: 'auth-callback',
  template: '',
})
export class OAuthCallbackComponent implements OnInit, OnDestroy {
  param_sub: any;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.param_sub = this.route.queryParams.subscribe(params => {
      if (params['code'] !== undefined) {
        this.authService.callback(params['code']);
        this.authService.login();
        this.sessionService.onReady().subscribe(
          () => {
            this.sessionService.navigateToStoredRoute();
          }
        );
      }
    });
  }

  ngOnDestroy() {
    this.param_sub.unsubscribe();
  }
}

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
