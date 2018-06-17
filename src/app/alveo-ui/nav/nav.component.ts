import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { SessionService } from '../shared/session.service';
import { Paths } from '../shared/paths';

import { environment } from '../../../environments/environment';

/* Navigation bar component, primarily handles logout option */
@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService
  ) { }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public actionLogin(): void {
    this.authService.initiateLogin();
  }

  public actionLogout(): void {
    this.authService.logout();
  }

  public goIndex(): void {
    this.sessionService.navigate([Paths.ListIndex]);
  }

  public goAlveoVL(): void {
    location.href = environment.alveoPaths.mainUrl;
  }
}
