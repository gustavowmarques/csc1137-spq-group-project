import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Patient } from 'src/app/core/models/patient.model';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patients$!: Observable<Patient[]>;
  searchTerm$ = new BehaviorSubject<string>('');
  canEdit = false;

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.canEdit = this.authService.hasAnyRole('Doctor', 'Admin');

    this.patients$ = this.searchTerm$.pipe(
      switchMap(term => {
        if (term.trim()) {
          return this.patientService.searchByName(term);
        }
        return this.patientService.getAll();
      })
    );
  }

  onSearch(term: string): void {
    this.searchTerm$.next(term);
  }
}
