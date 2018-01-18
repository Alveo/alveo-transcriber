import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';
import { SessionService } from '../shared/session.service';

import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.css'],
})

export class DataSourceComponent implements OnInit {
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): {
    this.getData(true, false);
  }

  isLoading(): boolean {
    return this.loading;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  requireLogin() {
    if (this.dialog.openDialogs.length < 1) {
      this.dialog.open(AuthComponent, {
        disableClose: true,
        data: {firstRun: true}}
      );
    }
  }

  getData(useCache: boolean=true, useApi: boolean=true): void {
    this.loading = true;
    this.alveoService.getListDirectory(useCache, useApi).subscribe(
      lists => {
        this.sessionService.setListIndex(lists).then(
          success => {
            this.sessionService.navigate(['lists/index']);
          },
          error => {
            console.log(error);
          }
        );
      },
      error => { this.loading = false; }
    );
  }
}
