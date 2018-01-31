import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';
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
  private ready: boolean = false;
  private lists: Array<any>;

  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
  ) {}

  ngOnInit() {
    this.alveoService.getListDirectory(true, false).subscribe(
      (lists) => {
        this.lists = lists;
        this.ready = true;
      },
      (error) => {
        if (error === 403 && !this.authService.isLoggedIn()) {
          this.authService.promptLogin();
        } else {
          console.log(error)
        }
      }
    );
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
    this.sessionService.navigate([Paths.ListView+id]);
  }
}
