import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';
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
  private loading: boolean = false;

  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
  ) {}

  ngOnInit() {
    this.getData(true, false).catch(
      (error) => {
        if (!this.authService.isLoggedIn()) {
          this.authService.promptLogin(true);
        } else {
          console.log(error);
        }
      }
    );
  }

  public isLoading(): boolean {
    return this.loading;
  }

  public getData(useCache: boolean= true, useApi: boolean= true): Promise<any> {
    this.loading = true;
    return new Promise(
      (resolve, reject) => {
        this.alveoService.getListDirectory(useCache, useApi).subscribe(
          lists => {
            this.sessionService.navigate([Paths.ListIndex]);
            resolve(lists);
          },
          error => { this.loading = false; reject(error) }
        );
      }
    );
  }
}
