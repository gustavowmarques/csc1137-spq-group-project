import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Visit } from 'src/app/core/models/visit.model';
import { VisitService } from 'src/app/core/services/visit.service';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Patient } from 'src/app/core/models/patient.model';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit {
  visits$: Observable<Visit[]> = of([]);
  patients$!: Observable<Patient[]>;
  selectedPatientId = '';
  isDoctor = false;
  hasPatientContext = false;
  deleting: Record<string, boolean> = {};

  constructor(
    private visitService: VisitService,
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
      this.loadVisits();
    }
  }

  onPatientChange(patientId: string): void {
    this.selectedPatientId = patientId;
    this.loadVisits();
  }

  private loadVisits(): void {
    if (this.selectedPatientId) {
      this.visits$ = this.visitService.getByPatientId(this.selectedPatientId);
    }
  }

  async deleteVisit(visit: Visit): Promise<void> {
    if (!visit.id || !this.isDoctor) {
      return;
    }

    const confirmed = globalThis.confirm('Delete this visit?');
    if (!confirmed) {
      return;
    }

    this.deleting[visit.id] = true;
    try {
      await this.visitService.delete(visit.id);
    } catch (err) {
      console.error('Failed to delete visit', err);
    } finally {
      this.deleting[visit.id] = false;
    }
  }
}
