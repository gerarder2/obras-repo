import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment.dev';
import { map } from 'rxjs/operators';
import { ValidaVersionService } from './valida-version.service';

@Injectable()
export class AuthenticationService {
  @BlockUI() blockUI: NgBlockUI;

  public settings: any;
  public apiLogin: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private configService: ConfigService,
    private validaVersion: ValidaVersionService
  ) {
    this.settings = this.configService.getConfig();
    this.apiLogin = this.settings.webApiMaatCore + '/login';
  }

  login(credential: any, automatico?: boolean) {
    let url = this.settings.webApiMaatCore + '/Login';
    credential.idSistema = environment.idSistema;
    if (automatico) {
      url = this.settings.webApiMaatCore + '/agregarUsuario';
    }
    return this.http.post<any>(url, credential).pipe(
      map((user) => {
        // login successful if there's a jwt token in the response
        if (user.data) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.data));
        }
        return user.data;
      })
    );
  }

  loginAutomatico(token: string) {
    this.http.post<any>(this.settings.webApiMaatCore + '/agregarUsuario', { Token: token }).subscribe(
      (resp) => {
        if (resp.Data) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(resp.Data));
        }
        this.blockUI.stop();
        if (!resp.Data.EsUsuarioCliente) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['clientes']);
        }
      },
      (error: unknown) => {
        console.warn(error);
      }
    );
    // this.http.post<any>(this.settings.webApi + '/agregarUsuario', { Token: token }).pipe(
    //   map((user) => {
    //     if (user.Data) {
    //       // store user details and jwt token in local storage to keep user logged in between page refreshes
    //       localStorage.setItem('currentUser', JSON.stringify(user.Data));
    //     }
    //     this.blockUI.stop();
    //     if (!user.Data.EsUsuarioCliente) {
    //       this.router.navigate(['/']);
    //     } else {
    //       this.router.navigate(['clientes']);
    //     }
    //   })
    // );
  }

  loginValidaUsuario(credential: any): Observable<any> {
    return this.http.post(this.apiLogin, credential);
  }

  regresarModuloActivo() {
    if (this.router.url.substring(0, 15) === '/Administrativo') {
      return 'Administrativo';
    } else if (this.router.url.substring(1, 20) === 'Atencion-a-Clientes') {
      return 'Atencion a Clientes';
    } else {
      return 'Ventas';
    }
  }

  regresarRutaActual() {
    if (this.router.url.substring(0, 15) === '/Administrativo') {
      return 'Administrativo';
    } else if (this.router.url.substring(1, 20) === 'Atencion-a-Clientes') {
      return 'Atencion-a-Clientes';
    } else {
      return 'Ventas';
    }
  }

  isAuth() {
    if (localStorage.getItem('currentUser')) {
      return true;
    } else {
      return false;
    }
  }

  currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  autorizacion(id) {
    const usuario = JSON.parse(localStorage.getItem('currentUser'));
    if (usuario.Autorizaciones.length > 0) {
      const autorizacion = usuario.Autorizaciones.find((autorizacion) => autorizacion.Id === id);

      if (autorizacion) {
        return true;
      }
    }

    return false;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.validaVersion.restartInterval();
    if (environment.production) {
      window.location.href = this.settings.redirectUrl;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
