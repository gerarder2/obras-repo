import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicitacionesRoutingModule } from './licitaciones-routing.module';
import { LicitacionesComponent } from './licitaciones.component';
import { ProgressBarModule } from 'primeng/progressbar';

// import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [LicitacionesComponent],
  imports: [CommonModule, LicitacionesRoutingModule, ProgressBarModule]
})
export class LicitacionesModule {}
