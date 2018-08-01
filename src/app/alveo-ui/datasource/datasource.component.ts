import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AlveoClientService } from '../../alveo-client/alveo-client.module';
import { SessionService } from '../../session/session.module';

import { AuthService } from '../shared/auth.service';
import { Paths } from '../shared/paths';

/* DataSourceComponent is used to preload data from the indexeddb if it is available.
 * If it is not available, it will offer the user an option to download it from a data source.
 *
 * Currently only the Alveo Virtual Laboratory is supported, but we hope to be able to support
 * more providers in future.
 * */
@Component({
  selector: 'app-datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.css'],
})
export class DataSourceComponent implements OnInit {
  private isWorking: boolean= true;

  constructor(
    private authService: AuthService,
    private alveoClientService: AlveoClientService,
    private sessionService: SessionService,
  ) {}

  ngOnInit() {
    /* Attempt to load data from the cache only */
    this.loadData(true, false);
  }

  public async loadData(useCache: boolean= true, useApi: boolean= true): Promise<any> {
    try {
      // Setting this to true changes the component to display a loading spinner.
      this.isWorking = true;

      // Have the AlveoClientService retrieve data based on the parameters
      // we are permitted to work with. In general we will check the
      // cache first, and if that doesn't work we'll let the user know there's
      // no data so that they can do a request via the API.
      await this.alveoClientService.getListDirectory(useCache, useApi);

      // If we reach this point, we successfully retrieved some data.
      // We don't need to be here any more since we have data to work with,
      //  so we'll automatically move to the ListIndex view.
      await this.sessionService.navigate([Paths.ListIndex]);
    } catch (error) {
      // Loading failed so we'll disable the spinner, thus reverting the view.
      this.isWorking = false;

      if (!this.authService.isLoggedIn()) {
        // It most likely failed to find any data or it couldn't find any
        //  because we're not logged in. Let's let the user know.
        //
        // It's important to know this is likely their first login, as not
        // having a list index means they've probably not ran the application
        // before.
        this.authService.promptLogin(true);
      }

      if (error.name === 'HttpErrorResponse') {
        // We've encountered something unexpected, possibly a backend or
        //  internet connection issue. Let's let the user know so they're
        //  not in the dark.
        this.sessionService.displayError(error.message, error);
      }
    }
  }
}
