import { Component, OnInit } from '@angular/core';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';
import { DBService, Databases } from '../shared/db.service';
import { SessionService } from '../shared/session.service';

import { Paths } from '../shared/paths'

/* Development/Debug component for controlling and testing session & database storage */
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

  /* Attempts to set lists storage to null, then requests a refresh */
  public refreshData(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.promptLogin();
    } else {
      this.dbService.instance(Databases.Cache).put('lists', {storage:null}).then(
        () => {
          this.alveoService.getListDirectory().subscribe(
            data => {
              this.sessionService.navigate([Paths.SelectDataSource]);
            },
            error => {
              console.log(error);
            }
          )
        }
      ).catch(
        (error) => console.log(error)
      );
    }
  }

  /* Delete annotations db */
  public deleteAnnotations(): void {
    this.dbService.instance(Databases.Annotations).destroy();
  }

  /* Delete cache db then redirect to index */
  public deleteCache(): void {
    this.dbService.instance(Databases.Cache).destroy().then(
      () => {
          this.sessionService.reset();
          this.sessionService.navigate([Paths.Index]);
        }
      ).catch(
       (error) => console.log(error)
      );
  }

  /* Clear session data and redirect to index */
  public resetSession(): void {
    this.sessionService.reset();
    this.sessionService.updateStorage().then(
      () => this.sessionService.navigate([Paths.Index])
    ).catch(
      (error) => console.log(error)
    );
  }
}
