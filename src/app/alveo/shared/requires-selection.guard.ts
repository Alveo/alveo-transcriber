import { Injectable } from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot
} from '@angular/router';

import { AlveoService } from './alveo.service';

@Injectable()
export class RequiresSelectionGuard implements CanActivate {
  constructor(private alveoService: AlveoService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.alveoService.getActiveList() != null) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
