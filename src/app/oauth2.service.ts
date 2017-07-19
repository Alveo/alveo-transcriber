import { Injectable } from '@angular/core';
import { AuthInterface } from './auth.interface'

@Injectable()
export class OAuth2Service implements AuthInterface {
  loggedIn = false;

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  initiateLogin(): void {
    this.login();
  }

  login(): void {
    this.loggedIn = true;
  }

  initiateLogout(): void {
    this.logout();
  }

  logout(): void {
    this.loggedIn = false;
  }
}
