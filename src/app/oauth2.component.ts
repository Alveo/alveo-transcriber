import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppUtilService } from './app-util.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'oauth2',
  templateUrl: './oauth2.component.html',
  styleUrls: ['./oauth2.component.css'],
})

export class OAuth2Component implements OnInit, OnDestroy {
  param_sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public appService: AppUtilService) { }

  actionLogin(): void {
    this.appService.auth.initiateLogin();
  }

  ngOnInit() {
    this.param_sub = this.route.queryParams.subscribe(params => {
      if (params['code'] != undefined) {
        this.appService.auth.registerToken(params['code'])
        this.appService.auth.login()
        this.router.navigate(['./itemlists']);
      }
    });
  }

  ngOnDestroy() {
    this.param_sub.unsubscribe();
  }
}
