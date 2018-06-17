import { Component } from '@angular/core';

import { SessionService } from '../../session/session.module';
import { environment } from '../../../environments/environment';

import { AuthService } from '../shared/auth.service';
import { Paths } from '../shared/paths';

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
