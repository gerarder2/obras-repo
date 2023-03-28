import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BlockUIModule } from 'ng-block-ui';
import { CommonModule } from '@angular/common';
import { LoginAutomaticoComponent } from './login-automatico.component';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    ToasterModule.forRoot(),
    BlockUIModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  declarations: [LoginComponent, RegisterComponent, LoginAutomaticoComponent],
  exports: [LoginComponent]
})
export class LoginModule {}
