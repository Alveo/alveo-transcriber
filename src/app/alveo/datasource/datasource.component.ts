import { Component, ViewChild, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
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
  @ViewChild('dataPromptTemplate')
  private dataPromptTemplate: TemplateRef<any>;

  ready = false;

  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.getData(true, false);
    this.whenReady().subscribe(
      () => {
        if (!this.authService.isLoggedIn()) {
          this.authService.promptLogin();
        } else {
          this.viewContainerRef.createEmbeddedView(this.dataPromptTemplate);
          console.log(this.dataPromptTemplate);
        }
      }
    );
  }

  public whenReady(): Observable<any> {
    return new Observable(
      (observer) => {
        const interval = setInterval(() => {
          if (this.ready === true) {
            clearInterval(interval);
            observer.next();
            observer.complete();
          }
        }, 5);
      }
    );
  }

  public getData(useCache: boolean= true, useApi: boolean= true): void {
    this.ready = false;
    this.alveoService.getListDirectory(useCache, useApi).subscribe(
      lists => {
        this.sessionService.setListIndex(lists);
        this.sessionService.navigate([Paths.ListIndex]);
      },
      error => { this.ready = true; console.log(error) }
    );
  }
}
