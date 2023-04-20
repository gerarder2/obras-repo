import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicitacionesComponent } from './licitaciones.component';

const routes: Routes = [
  {
    path: '',
    component: LicitacionesComponent,
    data: {
      title: 'Licitaciones'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicitacionesRoutingModule {}
