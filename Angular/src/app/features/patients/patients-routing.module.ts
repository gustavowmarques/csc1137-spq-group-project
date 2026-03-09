import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';

// routes for the patients feature, only accessible by doctors
const routes: Routes = [
  { path: '', component: PatientListComponent },
  {
    path: 'new',
    component: PatientFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Doctor'] }
  },
  { path: ':id', component: PatientDetailComponent },
  {
    path: ':id/edit',
    component: PatientFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Doctor'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
