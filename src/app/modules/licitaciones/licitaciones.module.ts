import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicitacionesRoutingModule } from './licitaciones-routing.module';
import { LicitacionesComponent } from './licitaciones.component';


@NgModule({
  declarations: [
    LicitacionesComponent
  ],
  imports: [
    CommonModule,
    LicitacionesRoutingModule
  ]
})
export class LicitacionesModule { }
