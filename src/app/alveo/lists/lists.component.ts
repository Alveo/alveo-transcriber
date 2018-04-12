import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';
import { SessionService } from '../shared/session.service';

import { Paths } from '../shared/paths';

/* Component to handle an outer list display
 *   Displays list name, size
 *   Provides list items to the items component */
@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  private list_id: any;
  private list: Array<any> = null;
  private ready: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.list_id = params['id'];
        if (this.list_id === undefined) {
          this.sessionService.navigate([Paths.ListIndex]);
        } else {
          this.alveoService.getList(this.list_id).subscribe(
            list => {
              this.list = list;
              this.ready = true;
            },
            error => {
              if (error.code === 401 && !this.authService.isLoggedIn()) {
                this.authService.promptLogin();
                this.ready = true;
              } else {
                this.sessionService.displayError(error.message, error);
              }
            }
          );
        }
      }
    );
  }

  public isReady(): boolean {
    return this.ready;
  }

  public getList(): Array<any> {
    return this.list;
  }

  public getListSize(): number {
    const list = this.getList();
    if (list === null) {
      return 0;
    }
    return list['num_items'];
  }

  public getListName(): string {
    const list = this.getList();
    if (list === null) {
      return '';
    }
    return list['name'];
  }

  public getListItems(): Array<any> {
    const list = this.getList();
    if (list === null) {
      return [];
    }
    return list['items'];
  }

  public actionBack(): void {
    this.sessionService.navigate([Paths.ListIndex]);
  }

  public transcribe(ev: any): void {
    this.sessionService.navigate([Paths.Transcriber, this.list_id, ev['item']['collection'], ev['item']['id'], ev['doc']['id']]);
  }
}
