import { Component, OnInit } from '@angular/core';

import { AlveoClientService } from '../../alveo-client/alveo-client.module';
import { AnnotationsService } from '../../annotations/annotations.module';
import { SessionService } from '../../session/session.module';

import { AuthService } from '../shared/auth.service';
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
    private alveoClientService: AlveoClientService,
    private sessionService: SessionService,
    private annotationsService: AnnotationsService
  ) {}

  /* Attempts to set lists storage to null, then requests a refresh */
  public async refreshData() {
    if (!this.authService.isLoggedIn()) {
      this.authService.promptLogin();
    } else {
      try {
        await this.alveoClientService.purgeCacheByKey('lists');
        this.sessionService.navigate([Paths.SelectDataSource]);
      } catch (error) {
        this.sessionService.displayError(error.message, error);
      }
    }
  }

  /* Delete annotations db */
  public deleteAnnotations(): void {
    this.annotationsService.destroyData();
  }

  /* Delete cache db then redirect to index */
  public async deleteCache() {
    try {
      await this.alveoClientService.purgeCache();
      this.sessionService.reset();
      this.sessionService.navigate([Paths.SelectDataSource]);
    } catch (error) {
      this.sessionService.displayError(error.message, error);
    }
  }

  /* Clear session data and redirect to index */
  public async resetSession() {
    this.sessionService.reset();
    try {
      await this.sessionService.updateStorage();
      this.sessionService.navigate([Paths.Index]);
    } catch (error) {
      this.sessionService.displayError(error.message, error);
    }
  }
}
