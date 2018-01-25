import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';
import { SessionService } from '../shared/session.service';

import { AuthComponent } from '../auth/auth.component';

import { Paths } from '../shared/paths';

/* Component used to sort through logic on stored list directory data
 *
 *  Prompts users for login if they have reached the page with no auth
 *  Prompts users to push download button if authenticated, but no data cached
 *  Downloads data then redirects if successful
 * */
@Component({
  selector: 'datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.css'],
})
export class DataSourceComponent implements OnInit {
  ready: boolean = false;

  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getData(true, false);
  }

  isReady(): boolean {
    return this.ready;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  requireLogin() {
    setTimeout(() => {
      if (this.dialog.openDialogs.length < 1) {
        this.dialog.open(AuthComponent, {
          disableClose: true,
          data: {firstRun: true}}
        );
      }
    }, 50);
  }

  getData(useCache: boolean=true, useApi: boolean=true): void {
    this.ready = false;
    this.alveoService.getListDirectory(useCache, useApi).subscribe(
      lists => {
        this.sessionService.setListIndex(lists);
        this.sessionService.navigate([Paths.ListIndex]);
      },
      error => { this.ready = true; console.log(error) }
    );
  }
}
