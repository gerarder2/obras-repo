import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ICredential } from './../../models/ICredential';
import { Mensaje } from '../../models';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  @BlockUI('login-section') blockUI: NgBlockUI;
  credential: ICredential = {};
  config = { modal: true };
  loading = false;
  returnUrl: string;
  public modalRef: BsModalRef;
  public mensaje: Mensaje;
  public loginForm: FormGroup;
  public eyeIcon: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.mensaje = new Mensaje();
    this.eyeIcon = true;
  }

  ngOnInit() {
    this.auth.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginForm = this.fb.group({
      Usuario: new FormControl(null, Validators.required),
      Password: new FormControl(null, Validators.required)
    });
  }

  public login(automatico?: boolean, token?: string) {
    this.credential = this.loginForm.value;
    this.credential.Plataforma = 'WEB';
    this.credential.Token = token ? token : null;
    this.loading = true;
    this.blockUI.start('Procesando...');
    this.auth.login(this.credential, automatico).subscribe(
      (resp) => {
        this.loading = false;
        this.blockUI.stop();
        if (!resp.EsUsuarioCliente) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['clientes']);
        }
      },
      (error: unknown) => {
        this.loading = false;
        this.blockUI.stop();
        this.mensaje.showMessage(error);
      }
    );
  }
}
