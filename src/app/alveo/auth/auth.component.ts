import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../shared/auth.service';

import { Paths } from '../shared/paths';

@Component({
  selector: 'auth-callback',
  template: '',
})
export class OAuthCallbackComponent implements OnInit, OnDestroy {
  param_sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.param_sub = this.route.queryParams.subscribe(params => {
      if (params['code'] !== undefined) {
        this.authService.callback(params['code']);
        this.authService.login();
        this.router.navigate([Paths.Index]);
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
