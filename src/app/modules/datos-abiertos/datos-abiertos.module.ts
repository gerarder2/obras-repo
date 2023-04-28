import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosAbiertosRoutingModule } from './datos-abiertos-routing.module';
import { DatosAbiertosComponent } from './datos-abiertos.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [DatosAbiertosComponent],
  imports: [CommonModule, DatosAbiertosRoutingModule, NgxChartsModule]
})
export class DatosAbiertosModule {}
