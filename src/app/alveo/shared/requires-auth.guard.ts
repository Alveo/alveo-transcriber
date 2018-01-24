import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable()
export class RequiresAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.sessionService.isLoading()) {
      this.sessionService.refreshSession(state.url)
      return false;
    }

    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.sessionService.refreshSession();
    return false;
  }
}
