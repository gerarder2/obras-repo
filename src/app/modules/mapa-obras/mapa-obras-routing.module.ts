import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaObrasComponent } from './mapa-obras.component';

const routes: Routes = [
  {
    path: '',
    component: MapaObrasComponent,
    data: {
      title: 'Mapa Obras'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaObrasRoutingModule {}
