import { Component, OnInit } from '@angular/core';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';
import { DBService } from '../shared/db.service';
import { SessionService } from '../shared/session.service';

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
      this.authService.initiateLogin();
    } else {
      this.dbService.put('lists', {storage:null}).then(
        success => {
          this.alveoService.getListDirectory().subscribe(
            data => {
              this.sessionService.navigate(['/']);
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
    this.dbService.destroy().then(
      success => {
        this.sessionService.navigate(['/']);
      },
      error => {
        console.log(error);
      }
    );
  }
}
