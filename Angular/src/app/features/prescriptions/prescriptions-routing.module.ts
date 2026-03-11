import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrescriptionListComponent } from './components/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from './components/prescription-form/prescription-form.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  { path: '', component: PrescriptionListComponent },
  {
    path: 'new',
    component: PrescriptionFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Doctor'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionsRoutingModule { }
