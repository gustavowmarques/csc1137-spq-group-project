import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDetailComponent } from './patient-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { VisitService } from 'src/app/core/services/visit.service';
import { PrescriptionService } from 'src/app/core/services/prescription.service';
import { AllergyService } from 'src/app/core/services/allergy.service';

describe('PatientDetailComponent', () => {
  let component: PatientDetailComponent;
  let fixture: ComponentFixture<PatientDetailComponent>;

  let mockPatientService: any;
  let mockAuthService: any;
  let mockVisitService: any;
  let mockPrescriptionService: any;
  let mockAllergyService: any;

  const mockPatient = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2000-01-01'
  };

  beforeEach(async () => {

    mockPatientService = {
      getById: jasmine.createSpy().and.returnValue(of(mockPatient))
    };

    mockAuthService = {
      hasRole: jasmine.createSpy().and.returnValue(true)
    };

    mockVisitService = {
      getByPatientId: jasmine.createSpy().and.returnValue(of([]))
    };

    mockPrescriptionService = {
      getByPatientId: jasmine.createSpy().and.returnValue(of([])),
      delete: jasmine.createSpy().and.resolveTo({})
    };

    mockAllergyService = {
      getByPatientId: jasmine.createSpy().and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [PatientDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123'
              }
            }
          }
        },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: VisitService, useValue: mockVisitService },
        { provide: PrescriptionService, useValue: mockPrescriptionService },
        { provide: AllergyService, useValue: mockAllergyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get patient id from route', () => {
    expect(component.patientId).toBe('123');
  });

  it('should call getById with correct id', () => {
    expect(mockPatientService.getById).toHaveBeenCalledWith('123');
  });

  it('should allow edit if user is Doctor', () => {
    expect(component.canEdit).toBeTrue();
    expect(component.isDoctor).toBeTrue();
    expect(mockAuthService.hasRole).toHaveBeenCalledWith('Doctor');
  });

  it('should NOT allow edit if user is not Doctor', () => {
    mockAuthService.hasRole.and.returnValue(false);

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.canEdit).toBeFalse();
    expect(component.isDoctor).toBeFalse();
  });

  it('should change active tab', () => {
    component.setTab('prescriptions');
    expect(component.activeTab).toBe('prescriptions');

    component.setTab('allergies');
    expect(component.activeTab).toBe('allergies');
  });

  it('should delete prescription when confirmed and doctor', async () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const prescription = { id: 'p1', drugName: 'Paracetamol' };

    await component.deletePrescription(prescription as any);

    expect(mockPrescriptionService.delete).toHaveBeenCalledWith('p1');
  });

  it('should NOT delete if user cancels confirmation', async () => {
    spyOn(window, 'confirm').and.returnValue(false);

    const prescription = { id: 'p1', drugName: 'Paracetamol' };

    await component.deletePrescription(prescription as any);

    expect(mockPrescriptionService.delete).not.toHaveBeenCalled();
  });

  it('should NOT delete if user is not doctor', async () => {
    component.isDoctor = false;

    const prescription = { id: 'p1', drugName: 'Paracetamol' };

    await component.deletePrescription(prescription as any);

    expect(mockPrescriptionService.delete).not.toHaveBeenCalled();
  });

  it('should NOT delete if prescription has no id', async () => {
    spyOn(window, 'confirm');

    const prescription = { drugName: 'Paracetamol' };

    await component.deletePrescription(prescription as any);

    expect(mockPrescriptionService.delete).not.toHaveBeenCalled();
  });

  it('should set empty observables if no patientId', () => {
  const route = TestBed.inject(ActivatedRoute);

  spyOn(route.snapshot.paramMap, 'get').and.returnValue(null);

  component.ngOnInit();

  component.visits$.subscribe(v => expect(v).toEqual([]));
  component.prescriptions$.subscribe(p => expect(p).toEqual([]));
  component.allergies$.subscribe(a => expect(a).toEqual([]));
});

it('should NOT call services if no patientId', () => {
  const route = TestBed.inject(ActivatedRoute);

  spyOn(route.snapshot.paramMap, 'get').and.returnValue(null);

  mockVisitService.getByPatientId.calls.reset();
  mockPrescriptionService.getByPatientId.calls.reset();
  mockAllergyService.getByPatientId.calls.reset();

  component.ngOnInit();

  expect(mockVisitService.getByPatientId).not.toHaveBeenCalled();
  expect(mockPrescriptionService.getByPatientId).not.toHaveBeenCalled();
  expect(mockAllergyService.getByPatientId).not.toHaveBeenCalled();
});

it('should handle delete error', async () => {
  spyOn(window, 'confirm').and.returnValue(true);
  mockPrescriptionService.delete.and.rejectWith('error');

  const prescription = { id: 'p1', drugName: 'Test' };

  await component.deletePrescription(prescription as any);

  expect(mockPrescriptionService.delete).toHaveBeenCalled();
});

});