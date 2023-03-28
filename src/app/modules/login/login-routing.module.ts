import { RouterModule, Routes } from '@angular/router';

import { LoginAutomaticoComponent } from './login-automatico.component';
import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    component: environment.production ? LoginAutomaticoComponent : LoginComponent,
    data: {
      title: 'Login Page'
    }
  }
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  //   data: {
  //     title: 'Register Page',
  //   },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
