import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

/* Navigation bar component, primarily handles logout option */
@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  constructor(private authService: AuthService) { }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public actionLogin(): void {
    this.authService.initiateLogin();
  }

  public actionLogout(): void {
    this.authService.logout();
  }
}
