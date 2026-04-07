import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitListComponent } from './visit-list.component';
import { VisitService } from 'src/app/core/services/visit.service';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VisitListComponent', () => {
  let component: VisitListComponent;
  let fixture: ComponentFixture<VisitListComponent>;

  let mockVisitService: any;
  let mockPatientService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockVisitService = {
      getByPatientId: jasmine.createSpy('getByPatientId').and.returnValue(of([]))
    };

    mockPatientService = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of([]))
    };

    mockAuthService = {
      hasRole: jasmine.createSpy('hasRole').and.returnValue(true)
    };

    await TestBed.configureTestingModule({
      declarations: [VisitListComponent],
      providers: [
        { provide: VisitService, useValue: mockVisitService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => 'patient123'
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore app-patient-select
    }).compileComponents();

    fixture = TestBed.createComponent(VisitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isDoctor correctly', () => {
    expect(mockAuthService.hasRole).toHaveBeenCalledWith('Doctor');
    expect(component.isDoctor).toBeTrue();
  });

  it('should load patients on init', () => {
    expect(mockPatientService.getAll).toHaveBeenCalled();
  });

  it('should load visits when patientId exists', () => {
    expect(mockVisitService.getByPatientId).toHaveBeenCalledWith('patient123');
  });

  it('should update selectedPatientId and load visits', () => {
    component.onPatientChange('newPatient');

    expect(component.selectedPatientId).toBe('newPatient');
    expect(mockVisitService.getByPatientId).toHaveBeenCalledWith('newPatient');
  });

  it('should not load visits if patientId is empty', () => {
    component.selectedPatientId = '';
    component['loadVisits']();

    expect(mockVisitService.getByPatientId).not.toHaveBeenCalledWith('');
  });

  it('should set hasPatientContext true when patientId exists', () => {
    expect(component.hasPatientContext).toBeTrue();
  });

  it('should show empty message when no visits', () => {
    component.visits$ = of([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No visits found.');
  });

  it('should NOT load visits when no patientId in ngOnInit', () => {
  const route = TestBed.inject(ActivatedRoute);

  spyOn(route.snapshot.queryParamMap, 'get').and.returnValue(null);

  mockVisitService.getByPatientId.calls.reset();

  component.ngOnInit();

  expect(component.selectedPatientId).toBe('');
  expect(component.hasPatientContext).toBeFalse();
  expect(mockVisitService.getByPatientId).not.toHaveBeenCalled();
});
});