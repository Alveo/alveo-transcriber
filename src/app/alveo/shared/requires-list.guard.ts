import { Injectable } from '@angular/core';
import { 
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { SessionService } from './session.service';

@Injectable()
export class RequiresListGuard implements CanActivate {
  constructor(
    private sessionService: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.sessionService.getActiveList() != null) {
      return true;
    }

    this.sessionService.resetSession(state.url);
    return false;
  }
}
