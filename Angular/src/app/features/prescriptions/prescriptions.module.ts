import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PrescriptionsRoutingModule } from './prescriptions-routing.module';
import { PrescriptionListComponent } from './components/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from './components/prescription-form/prescription-form.component';

@NgModule({
  declarations: [
    PrescriptionListComponent,
    PrescriptionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrescriptionsRoutingModule
  ]
})
export class PrescriptionsModule { }
