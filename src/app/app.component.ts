import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './services/authentication.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: `
    <div>
      <block-ui></block-ui>
      <router-outlet></router-outlet>
      <app-app-update-popup></app-app-update-popup>
    </div>
  `
})
export class AppComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI | undefined;
  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthenticationService) {}

  ngOnInit() {
    if (this.auth.currentUser()) {
      if (this.auth.currentUser().EsUsuarioCliente) {
        this.router.navigate(['clientes']);
      }
    }
    // console.warn(this.router.url);
    // console.warn(this.auth.currentUser());
  }
}
