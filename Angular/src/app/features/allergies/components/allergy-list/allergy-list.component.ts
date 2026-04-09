import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Allergy } from 'src/app/core/models/allergy.model';
import { Patient } from 'src/app/core/models/patient.model';
import { AllergyService } from 'src/app/core/services/allergy.service';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-allergy-list',
  templateUrl: './allergy-list.component.html',
  styleUrls: ['./allergy-list.component.scss']
})
export class AllergyListComponent implements OnInit {
  allergies$: Observable<Allergy[]> = of([]);
  patients$!: Observable<Patient[]>;
  selectedPatientId = '';
  canAdd = false;
  isDoctor = false;
  hasPatientContext = false;
  deleting: Record<string, boolean> = {};

  constructor(
    private allergyService: AllergyService,
    private patientService: PatientService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.canAdd = this.authService.hasAnyRole('Doctor', 'Nurse');
    this.isDoctor = this.authService.hasRole('Doctor');
    this.patients$ = this.patientService.getAll();

    this.selectedPatientId = this.route.snapshot.queryParamMap.get('patientId') ?? '';
    this.hasPatientContext = !!this.selectedPatientId;
    if (this.selectedPatientId) {
      this.loadAllergies();
    }
  }

  onPatientChange(patientId: string): void {
    this.selectedPatientId = patientId;
    this.loadAllergies();
  }

  private loadAllergies(): void {
    if (this.selectedPatientId) {
      this.allergies$ = this.allergyService.getByPatientId(this.selectedPatientId);
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

    this.deleting[allergy.id] = true;
    try {
      await this.allergyService.delete(allergy.id);
    } catch (err) {
      console.error('Failed to delete allergy', err);
    } finally {
      this.deleting[allergy.id] = false;
    }
  }
}
