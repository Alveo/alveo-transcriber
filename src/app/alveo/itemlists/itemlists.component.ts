import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';

import { AuthComponent } from '../auth/auth.component';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'itemlists',
  templateUrl: './itemlists.component.html',
  styleUrls: ['./itemlists.component.css'],
})

export class ItemListsComponent implements OnInit {
  private loading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alveoService: AlveoService,
    private dialog: MatDialog
  ) { }

  isDevMode(): boolean {
    return environment.devTools;
  }

  requireLogin(firstRun= false) {
    if (this.dialog.openDialogs.length < 1) {
      this.dialog.open(AuthComponent, {
        disableClose: firstRun,
        data: {firstRun: firstRun}}
      );
    }
  }

  requireData() {
    if (this.listSize() === 0 && !this.isLoggedIn()) {
      this.noDataSource();
    }
  }

  noDataSource() {
    setTimeout(() => {
      this.requireLogin(true);
    }, 50);
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loading = false;
    } else {
      setTimeout(() => this.loading = false, 2000);
    }
  }

  isLoading(): boolean {
    return this.loading;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  listSize(): number {
    if (this.alveoService.getLists() !== undefined) {
      return this.alveoService.getLists().length;
    }
    return 0;
  }

  getLists(): any {
    return this.alveoService.getLists();
  }

  getData(): void {
    this.alveoService.getListDirectory();
  }

  onSelection(list): void {
    this.alveoService.getItems(list, (data) => {
      if (data === 403 && !this.isLoggedIn()) {
        this.requireLogin(false);
      } else {
        this.alveoService.selectedList = list;
        this.router.navigate(['./listview']);
      }
    });
  }
}
