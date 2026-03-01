import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/core/models/patient.model';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  patient$!: Observable<Patient | undefined>;
  patientId = '';
  canEdit = false;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ?? '';
    this.patient$ = this.patientService.getById(this.patientId);
    this.canEdit = this.authService.hasRole('Doctor');
  }
}
