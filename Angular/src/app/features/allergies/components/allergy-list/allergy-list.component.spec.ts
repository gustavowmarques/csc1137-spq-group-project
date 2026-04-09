import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllergyListComponent } from './allergy-list.component';
import { of } from 'rxjs';
import { AllergyService } from 'src/app/core/services/allergy.service';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AllergyListComponent', () => {
  let component: AllergyListComponent;
  let fixture: ComponentFixture<AllergyListComponent>;
  let mockAllergyService: any;
  let mockPatientService: any;
  let mockAuthService: any;
  let mockRoute: any;

  beforeEach(async () => {
    mockAllergyService = {
      getByPatientId: jasmine.createSpy().and.returnValue(of([]))
    };

    mockPatientService = {
      getAll: jasmine.createSpy().and.returnValue(of([]))
    };

    mockAuthService = {
      hasAnyRole: jasmine.createSpy().and.returnValue(true),
      hasRole: jasmine.createSpy().and.returnValue(true)
    };

    mockRoute = {
      snapshot: {
        queryParamMap: {
          get: jasmine.createSpy().and.returnValue('p123')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [AllergyListComponent],
      providers: [
        { provide: AllergyService, useValue: mockAllergyService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AllergyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set canAdd based on user role', () => {
    expect(mockAuthService.hasAnyRole).toHaveBeenCalledWith('Doctor', 'Nurse');
    expect(component.canAdd).toBeTrue();
  });

  it('should load patients on init', () => {
    expect(mockPatientService.getAll).toHaveBeenCalled();
    expect(component.patients$).toBeTruthy();
  });

  it('should set selectedPatientId from query params', () => {
    expect(component.selectedPatientId).toBe('p123');
  });

  it('should set hasPatientContext correctly', () => {
    expect(component.hasPatientContext).toBeTrue();
  });

  it('should load allergies if patientId exists', () => {
    expect(mockAllergyService.getByPatientId).toHaveBeenCalledWith('p123');
  });



it('should not load allergies if no patientId', () => {
  mockAllergyService.getByPatientId.calls.reset(); // 👈 reset previous calls

  mockRoute.snapshot.queryParamMap.get.and.returnValue(null);

  component.ngOnInit();

  expect(component.hasPatientContext).toBeFalse();
  expect(mockAllergyService.getByPatientId).not.toHaveBeenCalled();
});

  it('should update patientId and load allergies on patient change', () => {
    component.onPatientChange('new123');

    expect(component.selectedPatientId).toBe('new123');
    expect(mockAllergyService.getByPatientId).toHaveBeenCalledWith('new123');
  });

  it('should set allergies$ observable when loadAllergies is called', () => {
    component.selectedPatientId = 'abc123';

    (component as any).loadAllergies();

    expect(mockAllergyService.getByPatientId).toHaveBeenCalledWith('abc123');
  });

});