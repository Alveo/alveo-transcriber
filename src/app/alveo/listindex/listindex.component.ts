import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
export class ListIndexComponent {
  constructor(
    private authService: AuthService,
    private alveoService: AlveoService,
    private sessionService: SessionService,
  ) {}

  public isDevMode(): boolean {
    return environment.devTools;
  }

  public getLists(): any {
    return this.sessionService.getListIndex();
  }

  /* Attempt to retrieve a selected list */
  public onSelection(list): void {
    this.alveoService.getList(list['item_list_url']).subscribe(
      list => {
        this.sessionService.setActiveList(list);
        this.sessionService.navigate([Paths.ListView]);
      },
      error => {
        if (error===403 && !this.authService.isLoggedIn()) {
          this.authService.promptLogin();
        } else {
          console.log(error)
        }
      }
    );
  }
}
