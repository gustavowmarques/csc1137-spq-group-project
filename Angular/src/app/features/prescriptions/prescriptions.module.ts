import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PrescriptionsRoutingModule } from './prescriptions-routing.module';
import { PrescriptionListComponent } from './components/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from './components/prescription-form/prescription-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PrescriptionListComponent,
    PrescriptionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrescriptionsRoutingModule,
    SharedModule
  ]
})
export class PrescriptionsModule { }
