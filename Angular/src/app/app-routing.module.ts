import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { BlockAdminGuard } from './core/guards/block-admin.guard';
import { LayoutComponent } from './features/layout/layout.component';

// main app routes
const routes: Routes = [
  {
    path: '',
    redirectTo: 'patients',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // patients page is blocked for admin users
      {
        path: 'patients',
        loadChildren: () =>
          import('./features/patients/patients.module').then(m => m.PatientsModule)
        , canActivate: [BlockAdminGuard]
      },
      // {
      //   path: 'visits',
      //   loadChildren: () =>
      //     import('./features/visits/visits.module').then(m => m.VisitsModule)
      //   , canActivate: [BlockAdminGuard]
      // },
      // {
      //   path: 'prescriptions',
      //   loadChildren: () =>
      //     import('./features/prescriptions/prescriptions.module').then(m => m.PrescriptionsModule)
      //   , canActivate: [BlockAdminGuard]
      // },
      // {
      //   path: 'allergies',
      //   loadChildren: () =>
      //     import('./features/allergies/allergies.module').then(m => m.AllergiesModule)
      //   , canActivate: [BlockAdminGuard]
      // },
      // this route is for admin only for user management
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.module').then(m => m.UsersModule),
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'patients'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }