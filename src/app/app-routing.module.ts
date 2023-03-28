// Import Containers
import { FullLayoutComponent, SimpleLayoutComponent } from './containers';
import { Router, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { environment } from './../environments/environment';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
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
