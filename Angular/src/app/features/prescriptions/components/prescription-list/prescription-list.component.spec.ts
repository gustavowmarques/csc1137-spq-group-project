import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescriptionListComponent } from './prescription-list.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PrescriptionService } from 'src/app/core/services/prescription.service';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

describe('PrescriptionListComponent', () => {
  let component: PrescriptionListComponent;
  let fixture: ComponentFixture<PrescriptionListComponent>;

  let mockPrescriptionService: any;
  let mockPatientService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockPrescriptionService = {
      getByPatientId: jasmine.createSpy('getByPatientId').and.returnValue(of([])),
      delete: jasmine.createSpy('delete').and.resolveTo({})
    };

    mockPatientService = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of([]))
    };

    mockAuthService = {
      hasRole: jasmine.createSpy('hasRole').and.returnValue(true)
    };

    await TestBed.configureTestingModule({
      declarations: [PrescriptionListComponent],
      providers: [
        { provide: PrescriptionService, useValue: mockPrescriptionService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: { get: () => 'p1' }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isDoctor true', () => {
    expect(component.isDoctor).toBeTrue();
  });

  it('should load patients', () => {
    expect(mockPatientService.getAll).toHaveBeenCalled();
  });

  it('should load prescriptions on init if patientId present', () => {
    expect(mockPrescriptionService.getByPatientId).toHaveBeenCalledWith('p1');
  });

  it('should not load prescriptions if no patientId', () => {
  const route = TestBed.inject(ActivatedRoute);

  spyOn(route.snapshot.queryParamMap, 'get').and.returnValue(null);

  mockPrescriptionService.getByPatientId.calls.reset();

  component.ngOnInit();

  expect(mockPrescriptionService.getByPatientId).not.toHaveBeenCalled();
});

  it('should update selectedPatientId and load prescriptions', () => {
    component.onPatientChange('p2');

    expect(component.selectedPatientId).toBe('p2');
    expect(mockPrescriptionService.getByPatientId).toHaveBeenCalledWith('p2');
  });

  it('should not delete if no id', async () => {
    await component.deletePrescription({ drugName: 'Test' } as any);

    expect(mockPrescriptionService.delete).not.toHaveBeenCalled();
  });

  it('should not delete if not doctor', async () => {
    component.isDoctor = false;

    await component.deletePrescription({ id: '1', drugName: 'Test' } as any);

    expect(mockPrescriptionService.delete).not.toHaveBeenCalled();
  });

  it('should not delete if user cancels', async () => {
    spyOn(globalThis, 'confirm').and.returnValue(false);

    await component.deletePrescription({ id: '1', drugName: 'Test' } as any);

    expect(mockPrescriptionService.delete).not.toHaveBeenCalled();
  });

  it('should delete prescription', async () => {
    spyOn(globalThis, 'confirm').and.returnValue(true);

    await component.deletePrescription({ id: '1', drugName: 'Test' } as any);

    expect(component.deleting['1']).toBeFalse();
    expect(mockPrescriptionService.delete).toHaveBeenCalledWith('1');
  });

  it('should handle delete error', async () => {
    spyOn(globalThis, 'confirm').and.returnValue(true);
    mockPrescriptionService.delete.and.rejectWith('error');

    await component.deletePrescription({ id: '1', drugName: 'Test' } as any);

    expect(component.deleting['1']).toBeFalse();
  });

  it('should show empty message when no prescriptions', () => {
    component.prescriptions$ = of([]);

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No prescriptions found');
  });

});