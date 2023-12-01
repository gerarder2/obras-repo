// Import Containers
import { FullLayoutComponent, SimpleLayoutComponent } from './containers';
import { Router, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { environment } from './../environments/environment';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    canActivate: [AuthGuard],
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'licitaciones',
        loadChildren: () => import('./modules/licitaciones/licitaciones.module').then((m) => m.LicitacionesModule)
      },
      { path: 'obras', loadChildren: () => import('./modules/obras/obras.module').then((m) => m.ObrasModule) },
      {
        path: 'datos-abiertos',
        loadChildren: () => import('./modules/datos-abiertos/datos-abiertos.module').then((m) => m.DatosAbiertosModule)
      },
      {
        path: 'caminos',
        loadChildren: () => import('./modules/caminos/caminos.module').then((m) => m.CaminosModule)
      }
    ]
  },

  {
    path: 'login',
    component: SimpleLayoutComponent,
    data: {
      title: 'Login'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    if (environment.production) {
      this.router.errorHandler = (error: never) => {
        console.warn(error);
        // redirect to default route
        this.router.navigate(['/dashboard']);
      };
    }
  }
}
