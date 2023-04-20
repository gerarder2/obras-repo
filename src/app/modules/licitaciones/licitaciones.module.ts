import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicitacionesRoutingModule } from './licitaciones-routing.module';
import { LicitacionesComponent } from './licitaciones.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TableModule } from 'primeng/table';
import { DirectivesModule } from '../../directives/directives.module';
import { SharedModule } from 'primeng/api';
import { ModalModule } from 'ngx-bootstrap/modal';

// import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [LicitacionesComponent],
  imports: [
    CommonModule,
    LicitacionesRoutingModule,
    ProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CollapseModule.forRoot(),
    TableModule,
    DirectivesModule,
    SharedModule,
    ModalModule.forRoot()
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class LicitacionesModule {}
