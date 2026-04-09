import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Patient } from 'src/app/core/models/patient.model';
import { Visit } from 'src/app/core/models/visit.model';
import { Prescription } from 'src/app/core/models/prescription.model';
import { Allergy } from 'src/app/core/models/allergy.model';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { VisitService } from 'src/app/core/services/visit.service';
import { PrescriptionService } from 'src/app/core/services/prescription.service';
import { AllergyService } from 'src/app/core/services/allergy.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
// display patient details
export class PatientDetailComponent implements OnInit {
  patient$!: Observable<Patient | undefined>;
  visits$: Observable<Visit[]> = of([]);
  prescriptions$: Observable<Prescription[]> = of([]);
  allergies$: Observable<Allergy[]> = of([]);
  patientId = '';
  // only doctors can edit patient details
  canEdit = false;
  isDoctor = false;
  activeTab: 'visits' | 'prescriptions' | 'allergies' = 'visits';

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private authService: AuthService,
    private visitService: VisitService,
    private prescriptionService: PrescriptionService,
    private allergyService: AllergyService
  ) {}

  // grab patient id from url and fetch thier data
  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ?? '';
    this.patient$ = this.patientService.getById(this.patientId);
    this.visits$ = this.patientId ? this.visitService.getByPatientId(this.patientId) : of([]);
    this.prescriptions$ = this.patientId ? this.prescriptionService.getByPatientId(this.patientId) : of([]);
    this.allergies$ = this.patientId ? this.allergyService.getByPatientId(this.patientId) : of([]);
    this.isDoctor = this.authService.hasRole('Doctor');
    this.canEdit = this.authService.hasRole('Doctor');
  }

  setTab(tab: 'visits' | 'prescriptions' | 'allergies'): void {
    this.activeTab = tab;
  }

  async deletePrescription(prescription: Prescription): Promise<void> {
    if (!prescription.id || !this.isDoctor) {
      return;
    }

    const confirmed = window.confirm(`Delete prescription for ${prescription.drugName}?`);
    if (!confirmed) {
      return;
    }

    try {
      await this.prescriptionService.delete(prescription.id);
    } catch (err) {
      console.error('Failed to delete prescription', err);
    }
  }

  async deleteVisit(visit: Visit): Promise<void> {
    if (!visit.id || !this.isDoctor) {
      return;
    }

    const confirmed = window.confirm('Delete this visit?');
    if (!confirmed) {
      return;
    }

    try {
      await this.visitService.delete(visit.id);
    } catch (err) {
      console.error('Failed to delete visit', err);
    }
  }

  async deleteAllergy(allergy: Allergy): Promise<void> {
    if (!allergy.id || !this.isDoctor) {
      return;
    }

    const confirmed = window.confirm(`Delete allergy \"${allergy.allergen}\"?`);
    if (!confirmed) {
      return;
    }

    try {
      await this.allergyService.delete(allergy.id);
    } catch (err) {
      console.error('Failed to delete allergy', err);
    }
  }
}
