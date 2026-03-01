import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRedirectGuard } from 'src/app/core/guards/login-redirect.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginFormComponent,
    canActivate: [LoginRedirectGuard]
  },
  {
    path: 'login-form', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
