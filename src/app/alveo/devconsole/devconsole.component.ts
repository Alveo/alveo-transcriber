import { Component, OnInit } from '@angular/core';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';
import { DBService, Databases } from '../shared/db.service';
import { SessionService } from '../shared/session.service';

import { Paths } from '../shared/paths'

@Component({
  selector: 'dev-console',
  templateUrl: './devconsole.component.html',
  styleUrls: ['./devconsole.component.css'],
})

export class DevConsoleComponent {
  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
    private dbService: DBService
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getData(): void {
    if (!this.isLoggedIn()) {
      this.authService.promptLogin();
    } else {
      this.dbService.instance(Databases.Cache).put('lists', {storage:null}).then(
        success => {
          this.alveoService.getListDirectory().subscribe(
            data => {
              this.sessionService.navigate([Paths.SelectDataSource]);
            },
            error => {
              console.log(error);
            }
          );
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  resetStore(): void {
    this.dbService.instance(Databases.Cache).destroy().then(
      success => {
        this.sessionService.reset();
        this.sessionService.navigate([Paths.Index]);
      },
      error => {
        console.log(error);
      }
    );
  }

  resetSession(): void {
    this.sessionService.reset();
    this.sessionService.updateStorage();
    this.sessionService.navigate([Paths.Index]);
  }
}
