import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';
import { SessionService } from '../shared/session.service';

import { AuthComponent } from '../auth/auth.component';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'listindex',
  templateUrl: './listindex.component.html',
  styleUrls: ['./listindex.component.css'],
})

export class ListIndexComponent {
  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {}

  isDevMode(): boolean {
    return environment.devTools;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  listSize(): number {
    return this.getLists().length;
  }

  getLists(): any {
    return this.sessionService.getListIndex();
  }

  requireLogin() {
    if (this.dialog.openDialogs.length < 1) {
      this.dialog.open(AuthComponent, {
        disableClose: false,
        data: {firstRun: false}}
      );
    }
  }

  onSelection(list): void {
    this.alveoService.getList(list['item_list_url']).subscribe(
      list => {
        this.sessionService.setActiveList(list);
        this.sessionService.navigate(['lists/view']);
      },
      error => {
        if (error===403 && !this.isLoggedIn()) {
          this.requireLogin();
        } else {
          console.log(error)
        }
      }
    );
  }
}
