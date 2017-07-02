import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
  loggedIn = false;

  isLoggedIn():boolean {
    return this.loggedIn;
  }

  login(): void {
    this.loggedIn = true;
  }

  logout(): void {
    this.loggedIn = false;
    // $http.get('/logout')
    // selecting = false;
  }
}
