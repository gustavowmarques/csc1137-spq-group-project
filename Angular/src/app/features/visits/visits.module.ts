import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VisitsRoutingModule } from './visits-routing.module';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { VisitFormComponent } from './components/visit-form/visit-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    VisitListComponent,
    VisitFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VisitsRoutingModule,
    SharedModule
  ]
})
export class VisitsModule { }
