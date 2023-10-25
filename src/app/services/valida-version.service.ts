import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidaVersionService {
  public showPopUp = new BehaviorSubject(false);
  public showPopUpObservable$ = this.showPopUp.asObservable();

  public showAlerta = new BehaviorSubject(false);
  public showAlertaObservable$ = this.showAlerta.asObservable();

  public consultarEndPoint = new BehaviorSubject(true);
  public enableEndPoint$ = this.consultarEndPoint.asObservable();

  public versionApi = new BehaviorSubject('');
  public versionApiObservable$ = this.versionApi.asObservable();

  public validaLogin = new BehaviorSubject(false);
  public validaLoginObservable$ = this.validaLogin.asObservable();

  private config: any;
  private url: string;
  private conLogin: boolean;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.config = configService.getConfig();
    this.url = `${this.config.webApiMaatCore}/Utilerias/version`;
    this.conLogin = environment.conLogin;
  }

  ActivaService() {
    if (this.config.intervalOn) {
      this.validaVersion();
      setInterval(() => {
        this.validaVersion();
      }, this.config.timeInterval);
    } else {
      this.validaVersion();
    }
  }

  validaVersion() {
    this.setValidaLogin(window.localStorage.getItem('currentUser') ? true : false);
    if (this.validaLogin.value) {
      if (this.consultarEndPoint.value) {
        this.getVersion().subscribe({
          next: (response: any) => {
            if (
              window.localStorage.getItem('version') === undefined ||
              window.localStorage.getItem('version') !== response.data
            ) {
              this.setEnableEndPoint(false);
              this.versionApi.next(response.data);
              this.setShowAlerta(true);
            }
          }
        });
      } else {
        this.setShowPopUp(true);
      }
    }
  }

  getVersion() {
    const idSistema = environment.idSistema;
    const url = `${this.url}?idSistema=${idSistema}`;
    return this.http.get(url);
  }

  public setShowPopUp(value: boolean) {
    this.showPopUp.next(value);
  }

  public setShowAlerta(value: boolean) {
    this.showAlerta.next(value);
  }

  public setValidaLogin(value: boolean) {
    this.validaLogin.next(value);
    if (this.conLogin === false) {
      this.validaLogin.next(true);
    }
  }

  public setEnableEndPoint(value: boolean) {
    this.consultarEndPoint.next(value);
  }

  public restartInterval() {
    this.setEnableEndPoint(true);
    this.setShowAlerta(false);
    this.setShowPopUp(false);
  }
}
