import { Injectable } from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot
} from "@angular/router";

import { AppUtilService } from './app-util.service';

@Injectable()
export class RequiresAuthGuard implements CanActivate {
  constructor(private appService: AppUtilService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.appService.auth.isLoggedIn()) { return true; }

    this.router.navigate([this.appService.auth.redirectLoginUrl]);
    return false;
  }
}
