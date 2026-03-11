import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/core/models/patient.model';

@Component({
  selector: 'app-patient-select',
  templateUrl: './patient-select.component.html',
  styleUrls: ['./patient-select.component.scss']
})
export class PatientSelectComponent {
  @Input() patients$!: Observable<Patient[]>;
  @Input() selectedPatientId = '';
  @Input() label = 'Select Patient';
  @Output() patientChange = new EventEmitter<string>();

  onChange(value: string) {
    this.patientChange.emit(value);
  }
}