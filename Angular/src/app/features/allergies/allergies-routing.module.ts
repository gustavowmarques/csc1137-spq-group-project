import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllergyListComponent } from './components/allergy-list/allergy-list.component';
import { AllergyFormComponent } from './components/allergy-form/allergy-form.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  { path: '', component: AllergyListComponent },
  {
    path: 'new',
    component: AllergyFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Doctor'] }
  },
  {
    path: ':id/edit',
    component: AllergyFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Doctor'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllergiesRoutingModule { }
