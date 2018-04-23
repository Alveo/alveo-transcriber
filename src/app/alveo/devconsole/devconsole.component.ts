import { Component, OnInit } from '@angular/core';

import { ApiService } from '../shared/api.service';
import { AnnotationService } from '../shared/annotation.service';
import { AuthService } from '../shared/auth.service';
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
    private annotationService: AnnotationService
  ) {}

  /* Attempts to set lists storage to null, then requests a refresh */
  public async refreshData() {
    if (!this.authService.isLoggedIn()) {
      this.authService.promptLogin();
    } else {
      try { 
        await this.apiService.purgeCacheByKey('lists');
        this.sessionService.navigate([Paths.SelectDataSource]);
      } catch(error) {
        this.sessionService.displayError(error.message, error);
      }
    }
  }

  /* Delete annotations db */
  public deleteAnnotations(): void {
    this.annotationService.destroyData();
  }

  /* Delete cache db then redirect to index */
  public async deleteCache() {
    try {
      await this.apiService.purgeCache();
      this.sessionService.reset();
      this.sessionService.navigate([Paths.SelectDataSource]);
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
