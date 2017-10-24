import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'auth-callback',
  template: '',
})
export class OAuthCallbackComponent implements OnInit, OnDestroy {
  param_sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.param_sub = this.route.queryParams.subscribe(params => {
      if (params['code'] != undefined) {
        this.authService.callback(params['code']);
        this.authService.login(() => {
          this.router.navigate(['./itemlists']);
        });
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authService: AuthService,
    public dialog: MatDialog
  ) { }

  isFirstRun(): boolean {
    return this.data.firstRun;
  }

  actionLogin(): void {
    this.authService.initiateLogin();
  }
}
