import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';

import { AuthComponent } from '../auth/auth.component';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'listindex',
  templateUrl: './listindex.component.html',
  styleUrls: ['./listindex.component.css'],
})

export class ListIndexComponent implements OnInit {
  lists: Array<any>;
  loading: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alveoService: AlveoService,
    private dialog: MatDialog
  ) {
    this.lists = [];
    this.loading = true;
  }

  ngOnInit(): void {
    this.downloadData();
  }

  downloadData(): void {
    this.loading = true;
    this.updateLists().subscribe(
      finish => { this.loading = false; },
      error => { this.loading = false; }
    );
  }

  updateLists(): Observable<any> {
    return new Observable((observer) => {
      this.alveoService.getListDirectory()
        .subscribe(
          lists => {
            this.lists = lists;
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  isLoading(): boolean {
    return this.loading;
  }

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

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  listSize(): number {
    return this.lists.length;
  }

  getLists(): any {
    return this.lists;
  }

  onSelection(list): void {
    this.alveoService.getList(list['item_list_url']).subscribe(
      listData => {
        this.alveoService.tmp_list = listData;
        console.log(listData);
        this.router.navigate(['./listview']);
      },
      error => {
        if (error===403 && !this.isLoggedIn()) {
        } else {
          console.log(error)
        }
      }
    );
  }
}
