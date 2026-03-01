import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';

@NgModule({
  declarations: [
    PatientListComponent,
    PatientFormComponent,
    PatientDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientsRoutingModule
  ]
})
export class PatientsModule { }
