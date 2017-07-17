import { Injectable } from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot
} from "@angular/router";

import { SessionService } from './session.service';

@Injectable()
export class RequiresAuthGuard implements CanActivate {
  constructor(private sessionService: SessionService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.sessionService.isLoggedIn()) { return true; }

    //this.sessionService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }
}
