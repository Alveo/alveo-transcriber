import { Injectable } from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot
} from "@angular/router";

import { AppUtilService } from './app-util.service';

@Injectable()
export class RequiresSelectionGuard implements CanActivate {
  constructor(private appService: AppUtilService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.appService.alveo.getActiveList() != null)
      return true;

    this.router.navigate(['/']);
    return false;
  }
}
