import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientSelectComponent } from './components/patient-select/patient-select.component';




@NgModule({
  declarations: [
    PatientSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PatientSelectComponent
  ]
})
export class SharedModule { }
