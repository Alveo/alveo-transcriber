import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})

export class NavComponent {
  constructor(public authService: AuthService) { }

  queryLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  actionLogout(): void {
    this.authService.initiateLogout();
  }
}
