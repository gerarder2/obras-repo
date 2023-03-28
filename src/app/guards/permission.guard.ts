import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class Permission implements CanActivateChild {
  constructor(private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const haveOpcion = JSON.parse(sessionStorage.getItem('opcionId'));
    const usuario = JSON.parse(localStorage.getItem('currentUser'));
    const modulos = usuario.ModulosAcceso;

    for (let i = 0; i < modulos.length; i++) {
      for (let j = 0; j < modulos[i].Opciones.length; j++) {
        if (haveOpcion === modulos[i].Opciones[j].Oid) {
          return true;
        }
      }
    }
    // if (haveOpcion) {
    //   return true;
    // }

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/pages/login'], { queryParams: { returnUrl: state.url } });
    this.router.navigate(['/']);
    return false;
  }
}
