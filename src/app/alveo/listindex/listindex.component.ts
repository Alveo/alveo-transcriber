import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/auth.service';
import { ApiService } from '../shared/api.service';
import { SessionService } from '../shared/session.service';

import { environment } from '../../../environments/environment';
import { Paths } from '../shared/paths';

/* Display component to show all item lists and handle selection events */
@Component({
  selector: 'listindex',
  templateUrl: './listindex.component.html',
  styleUrls: ['./listindex.component.css'],
})
export class ListIndexComponent implements OnInit {
  private ready = false;
  private lists: Array<any>;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private sessionService: SessionService,
  ) {}

  private async dataSetup() {
    try {
      const lists = await this.apiService.jsAlveo.getListDirectory(true, false);
      this.lists = lists['own'].concat(lists['shared']);
      this.ready = true;
    } catch(error) {
      if (error.status === 401) {
        this.authService.promptLogin();
      } else {
        this.sessionService.displayError(error.message, error);
      }
    }
  }

  ngOnInit() {
    this.dataSetup();
  }

  public isReady(): boolean {
    return this.ready;
  }

  public isDevMode(): boolean {
    return environment.devTools;
  }

  public getLists(): any {
    return this.lists;
  }

  /* Attempt to retrieve a selected list */
  public onSelection(list): void {
    const id = this.sessionService.shortenItemUrl(list['item_list_url']);
    this.sessionService.navigate([Paths.ListView + id]);
  }
}
