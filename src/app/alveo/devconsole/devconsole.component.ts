import { Component, OnInit } from '@angular/core';

import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { DBService, Databases } from '../shared/db.service';
import { SessionService } from '../shared/session.service';

import { Paths } from '../shared/paths';

/* Development/Debug component for controlling and testing session & database storage */
@Component({
  selector: 'dev-console',
  templateUrl: './devconsole.component.html',
  styleUrls: ['./devconsole.component.css'],
})
export class DevConsoleComponent {
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private sessionService: SessionService,
    private dbService: DBService
  ) {}

  /* Attempts to set lists storage to null, then requests a refresh */
  public async refreshData() {
    if (!this.authService.isLoggedIn()) {
      this.authService.promptLogin();
    } else {
      try { 
        await this.dbService.instance(Databases.Cache).put('lists', {storage: null});
        await this.apiService.getListDirectory();
        this.sessionService.navigate([Paths.SelectDataSource]);
      } catch(error) {
        this.sessionService.displayError(error.message, error);
      }
    }
  }

  /* Delete annotations db */
  public deleteAnnotations(): void {
    this.dbService.instance(Databases.Annotations).destroy();
  }

  /* Delete cache db then redirect to index */
  public async deleteCache() {
    try {
      await this.apiService.purgeCache();
      this.sessionService.reset();
      this.sessionService.navigate([Paths.Index]);
    } catch(error) {
      this.sessionService.displayError(error.message, error);
    }
  }

  /* Clear session data and redirect to index */
  public async resetSession() {
    this.sessionService.reset();
    try {
      await this.sessionService.updateStorage();
      this.sessionService.navigate([Paths.Index])
    } catch(error) {
      this.sessionService.displayError(error.message, error);
    }
  }
}
