import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/index';
import { ToasterConfig } from 'angular2-toaster';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
  public imgUrl: string;
  public appLogo: string;
  public user: any;
  public notificaciones: any[];
  public mensajes: any[];
  public haveMenu: boolean;

  public toasterconfig: ToasterConfig = new ToasterConfig({
    animation: 'flyRight'
  });

  constructor(private auth: AuthenticationService) {
    this.notificaciones = [];
    this.mensajes = [];
  }

  public ngOnInit() {
    this.user = this.auth.currentUser();
    this.imgUrl = 'assets/img/user-a.png';
    if (environment.production) {
      this.imgUrl = `${environment?.STATIC?.avatar}${this.user.id}.jpg`;
    }
    this.haveMenu = environment.haveMenu;
    this.appLogo = environment.appLogo;
  }
}
