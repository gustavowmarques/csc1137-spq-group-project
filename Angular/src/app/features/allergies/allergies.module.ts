import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AllergiesRoutingModule } from './allergies-routing.module';
import { AllergyListComponent } from './components/allergy-list/allergy-list.component';
import { AllergyFormComponent } from './components/allergy-form/allergy-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AllergyListComponent,
    AllergyFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AllergiesRoutingModule,
    SharedModule
  ]
})
export class AllergiesModule { }
