import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Prescription } from 'src/app/core/models/prescription.model';
import { Patient } from 'src/app/core/models/patient.model';
import { PrescriptionService } from 'src/app/core/services/prescription.service';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit {
  prescriptions$: Observable<Prescription[]> = of([]);
  patients$!: Observable<Patient[]>;
  selectedPatientId = '';
  isDoctor = false;
  hasPatientContext = false;
  deleting: Record<string, boolean> = {};

  constructor(
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isDoctor = this.authService.hasRole('Doctor');
    this.patients$ = this.patientService.getAll();

    this.selectedPatientId = this.route.snapshot.queryParamMap.get('patientId') ?? '';
    this.hasPatientContext = !!this.selectedPatientId;
    if (this.selectedPatientId) {
      this.loadPrescriptions();
    }
  }

  onPatientChange(patientId: string): void {
    this.selectedPatientId = patientId;
    this.loadPrescriptions();
  }

  private loadPrescriptions(): void {
    if (this.selectedPatientId) {
      this.prescriptions$ = this.prescriptionService.getByPatientId(this.selectedPatientId);
    }
  }

  async deletePrescription(prescription: Prescription): Promise<void> {
    if (!prescription.id || !this.isDoctor) {
      return;
    }

    const confirmed = window.confirm(`Delete prescription for ${prescription.drugName}?`);
    if (!confirmed) {
      return;
    }

    this.deleting[prescription.id] = true;
    try {
      await this.prescriptionService.delete(prescription.id);
    } catch (err) {
      console.error('Failed to delete prescription', err);
    } finally {
      this.deleting[prescription.id] = false;
    }
  }
}
