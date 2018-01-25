import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../shared/auth.service';
import { AlveoService } from '../shared/alveo.service';
import { SessionService } from '../shared/session.service';

import { environment } from '../../../environments/environment';
import { Paths } from '../shared/paths';

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

  isDevMode(): boolean {
    return environment.devTools;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  listSize(): number {
    return this.getLists().length;
  }

  getLists(): any {
    return this.sessionService.getListIndex();
  }

  requireLogin() {
    this.authService.promptLogin();
  }

  onSelection(list): void {
    this.alveoService.getList(list['item_list_url']).subscribe(
      list => {
        this.sessionService.setActiveList(list);
        this.sessionService.navigate([Paths.ListView]);
      },
      error => {
        if (error===403 && !this.isLoggedIn()) {
          this.requireLogin();
        } else {
          console.log(error)
        }
      }
    );
  }
}
