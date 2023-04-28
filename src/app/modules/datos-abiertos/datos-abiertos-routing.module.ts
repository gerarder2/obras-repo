import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosAbiertosComponent } from './datos-abiertos.component';

const routes: Routes = [
  {
    path: '',
    component: DatosAbiertosComponent,
    data: {
      title: 'Datos Abiertos'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosAbiertosRoutingModule {}
