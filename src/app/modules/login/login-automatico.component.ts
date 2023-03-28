import { ActivatedRoute, Params, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';
import { ConfigService } from './../../services/config.service';

@Component({
  selector: 'app-login-automatico',
  template: `
    <div class="app flex-row align-items-center" *blockUI="'login-section'">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card">
              <img class="card-img-top" src="assets/img/banner.png" alt="Card image cap" />
              <hr />
              <div class="card-body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginAutomaticoComponent implements OnInit {
  @BlockUI('login-section') blockUI: NgBlockUI;
  private cnfg: any;
  constructor(
    private configService: ConfigService,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cnfg = configService.getConfig();
  }

  ngOnInit() {
    this.blockUI.start('Identificando....');
    this.route.queryParams.subscribe((params: Params) => {
      if (params['token']) {
        this.auth.loginAutomatico(params['token']);
      } else if (this.auth.isAuth()) {
        this.blockUI.stop();
        this.router.navigate(['/']);
      } else {
        this.auth.logout();
        setTimeout(() => {
          window.location.href = this.cnfg.redirectUrl;
        }, 0);
      }
    });
  }
}
