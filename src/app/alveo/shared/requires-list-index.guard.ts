import { Injectable } from '@angular/core';
import { 
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { SessionService } from './session.service';

@Injectable()
export class RequiresListIndexGuard implements CanActivate {
  constructor(
    private sessionService: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.sessionService.isLoading()) {
      this.sessionService.refreshSession(state.url)
      return false;
    }

    if (this.sessionService.getListIndex() != null) {
      return true;
    }

    this.sessionService.refreshSession();
    return false;
  }
}
