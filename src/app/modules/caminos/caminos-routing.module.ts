import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaminosComponent } from './caminos.component';

const routes: Routes = [
  {
    path: '',
    component: CaminosComponent,
    data: {
      title: 'Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaminosRoutingModule {}
