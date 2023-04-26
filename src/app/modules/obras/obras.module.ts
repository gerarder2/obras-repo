import { CommonModule } from '@angular/common';
import { ObrasRoutingModule } from './obras-routing.module';
import { ObrasComponent } from './obras.component';
import { ObrasModalComponent } from './modal/obras-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { DirectivesModule } from '../../directives/directives.module';
import { TabViewModule } from 'primeng/tabview';
import { KnobModule } from 'primeng/knob';

import { LOCALE_ID, NgModule } from '@angular/core';

@NgModule({
  declarations: [ObrasComponent, ObrasModalComponent],
  imports: [
    CommonModule,
    ObrasRoutingModule,
    ProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CollapseModule.forRoot(),
    TableModule,
    DirectivesModule,
    ModalModule.forRoot(),
    TabViewModule,
    KnobModule
  ],
  exports: [ObrasModalComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class ObrasModule {}
