import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { VisitFormComponent } from './components/visit-form/visit-form.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  { path: '', component: VisitListComponent },
  {
    path: 'new',
    component: VisitFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Doctor'] }
  },
  {
    path: ':id/edit',
    component: VisitFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Doctor'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitsRoutingModule { }
