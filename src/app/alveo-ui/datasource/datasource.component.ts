import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AlveoClientService } from '../../alveo-client/alveo-client.module';

import { AuthService } from '../shared/auth.service';
import { SessionService } from '../shared/session.service';

import { Paths } from '../shared/paths';

/* Component used to sort through logic on stored list directory data
 *
 *  Prompts users for login if they have reached the page with no auth
 *  Prompts users to push download button if authenticated, but no data cached
 *  Downloads data then redirects if successful
 * */
@Component({
  selector: 'datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.css'],
})
export class DataSourceComponent implements OnInit {
  private loading = false;

  constructor(
    private authService: AuthService,
    private alveoClientService: AlveoClientService,
    private sessionService: SessionService,
  ) {}

  ngOnInit() {
    this.setUp();
  }

  public async setUp() {
    await this.getData(true, false);
  }

  public isLoading(): boolean {
    return this.loading;
  }

  public async getData(useCache: boolean= true, useApi: boolean= true): Promise<any> {
    this.loading = true;

    try {
      await this.alveoClientService.getListDirectory(useCache, useApi);
      await this.sessionService.navigate([Paths.ListIndex]);
    } catch (error) {
      this.loading = false;
      if (!this.authService.isLoggedIn()) {
        this.authService.promptLogin(true);
      }
      if (error.name == "HttpErrorResponse") {
        this.sessionService.displayError(error.message, error);
      }
    }
  }
}
