import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    }
    if (this.router.url.substring(1, 10) === 'parametro') {
      return true;
    }

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/pages/login'], { queryParams: { returnUrl: state.url } });
    this.router.navigate(['/login']);
    return false;
  }
}
