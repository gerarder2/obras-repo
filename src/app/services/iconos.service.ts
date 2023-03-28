import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Usuario } from '../models/Usuario';

@Injectable()
export class IconosService {
  public apiRoot: string;

  constructor(public http: HttpClient, public auth: AuthenticationService) {
    this.apiRoot = './assets/iconos.json';
  }

  getIconos(): Observable<any> {
    return this.http.get(this.apiRoot);
  }
}
