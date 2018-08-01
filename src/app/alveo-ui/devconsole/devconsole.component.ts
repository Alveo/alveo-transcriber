import { Component, OnInit } from '@angular/core';

import { AlveoClientService } from '../../alveo-client/alveo-client.module';
import { TranscriptionService } from '../../transcription/transcription.module';
import { SessionService } from '../../session/session.module';

import { AuthService } from '../shared/auth.service';
import { Paths } from '../shared/paths';

/* DevConsoleComponent was originally intended to be for development purposes.
 * It has become useful in controlling the data stored on a browser since.
 *
 * At some point it would be good to move this to a menu to control more
 * aspects, and so that the UI doesn't get cluttered with buttons.
 */
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
    private transcriptionService: TranscriptionService 
  ) {}

  public async updateItemListIndex() {
    if (!this.authService.isLoggedIn()) {
      // Can't refresh if we're not logged in. If the user doesn't have an
      // internet connection, they might have forgotten they'll need one
      // in order to refresh their item lists.
      this.authService.promptLogin();
    } else {
      try {
        // What we're actually doing here is redirecting the user to the
        // datasource component to load it. This is preferred for when
        // we add more datasources in, but we may need to re-explore this
        // as there could be multiple sources of data locally cached.
        await this.alveoClientService.purgeCacheByKey('lists');
        this.sessionService.navigate([Paths.SelectDataSource]);
      } catch (error) {
        // The cache didn't like something
        this.sessionService.displayError(error.message, error);
      }
    }
  }

  public deleteTranscriptions(): Promise<any> {
    return this.transcriptionService.destroyData();
  }

  public async deleteCache(): Promise<any> {
    try {
      // Like in updateItemListIndex(), we will purge what we need to
      // then redirect to the datasource component. We don't care as much
      // in this component as to whether they have an active internet
      // connection or not. Deleting something should be obvious enough
      // that they will need to replace it if they want to utilise it.
      await this.alveoClientService.purgeCache();
      this.sessionService.reset();
      this.sessionService.navigate([Paths.SelectDataSource]);
    } catch (error) {
      this.sessionService.displayError(error.message, error);
    }
  }

  public async resetSession(): Promise<any> {
    try {
      // This is a legacy function that deals with session data that
      // we may later again make use of.
      await this.sessionService.reset();
    } catch (error) {
      this.sessionService.displayError(error.message, error);
    }
  }
}
