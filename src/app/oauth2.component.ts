import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'oauth2',
  templateUrl: './oauth2.component.html',
})

export class OAuth2Component implements OnInit, OnDestroy {
  param_sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService) { }

  actionLogin(): void {
    this.authService.initiateLogin();
  }

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
