import { CatalogosService } from './../../services/catalogos.service';
import { ToasterModule } from 'angular2-toaster';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { BlockUIModule } from 'ng-block-ui';
import { LoginAutomaticoComponent } from './login-automatico.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    SharedComponentsModule,
    BlockUIModule.forRoot(),
    ToasterModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule
  ],
  providers: [CatalogosService],
  declarations: [LoginComponent, LoginAutomaticoComponent],
  exports: [LoginComponent]
})
export class LoginModule {}
