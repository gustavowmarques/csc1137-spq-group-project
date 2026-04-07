import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescriptionFormComponent } from './prescription-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { PrescriptionService } from 'src/app/core/services/prescription.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

describe('PrescriptionFormComponent', () => {
  let component: PrescriptionFormComponent;
  let fixture: ComponentFixture<PrescriptionFormComponent>;
  let mockService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockService = {
      getById: jasmine.createSpy('getById'),
      create: jasmine.createSpy('create').and.resolveTo({}),
      update: jasmine.createSpy('update').and.resolveTo({}),
      checkAllergyBlock: jasmine.createSpy('checkAllergyBlock').and.resolveTo(null),
      checkDrugConflicts: jasmine.createSpy('checkDrugConflicts').and.resolveTo([])
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PrescriptionFormComponent],
      providers: [
        { provide: PrescriptionService, useValue: mockService },
        { provide: AuthService, useValue: { currentUser: { uid: '123' } } },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: { get: () => 'p1' },
              paramMap: { get: () => null }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionFormComponent);
    component = fixture.componentInstance;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not save if form invalid', async () => {
    component.form.setValue({
      drugName: '',
      startDate: '',
      durationDays: null,
      dailyDosage: ''
    });

    await component.save();

    expect(component.form.touched).toBeTrue();
  });

  it('should create prescription', async () => {
    component.form.setValue({
      drugName: 'Paracetamol',
      startDate: component.todayDate,
      durationDays: 3,
      dailyDosage: 'Once'
    });

    await component.save();

    expect(mockService.create).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should block prescription if allergy exists', async () => {
    mockService.checkAllergyBlock.and.resolveTo('Penicillin');

    component.form.setValue({
      drugName: 'DrugX',
      startDate: component.todayDate,
      durationDays: 3,
      dailyDosage: 'Once'
    });

    await component.save();

    expect(component.blockMessage).toContain('Cannot prescribe');
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('should block if conflicts exist', async () => {
    mockService.checkDrugConflicts.and.resolveTo(['DrugY']);

    component.form.setValue({
      drugName: 'DrugX',
      startDate: component.todayDate,
      durationDays: 3,
      dailyDosage: 'Once'
    });

    await component.save();

    expect(component.blockMessage).toContain('conflicts');
  });

  it('should update prescription in edit mode', async () => {
    component.isEditMode = true;
    component.prescriptionId = 'id1';

    component.form.setValue({
      drugName: 'DrugX',
      startDate: component.todayDate,
      durationDays: 3,
      dailyDosage: 'Once'
    });

    await component.save();

    expect(mockService.update).toHaveBeenCalled();
  });

  it('should return error for past date', () => {
    const control = component.form.get('startDate');

    control?.setValue('2000-01-01');

    expect(control?.errors?.['beforeToday']).toBeTrue();
  });

  it('should allow today date', () => {
    const control = component.form.get('startDate');

    control?.setValue(component.todayDate);

    expect(control?.errors).toBeNull();
  });

  it('should return 1 if no dates', () => {
    const result = (component as any).calculateDurationDays({});
    expect(result).toBe(1);
  });

  it('should calculate end date correctly', () => {
    const result = (component as any).calculateEndDate('2026-01-01', 3);
    expect(result).toBe('2026-01-03');
  });

it('should redirect if no patientId', async () => {
  const route = TestBed.inject(ActivatedRoute);

  // 🔥 override query param
  spyOn(route.snapshot.queryParamMap, 'get').and.returnValue(null);

  await component.ngOnInit();

  expect(mockRouter.navigate).toHaveBeenCalledWith(['/patients']);
});

  it('should handle save error', async () => {
    mockService.create.and.rejectWith('error');

    component.form.setValue({
      drugName: 'DrugX',
      startDate: component.todayDate,
      durationDays: 3,
      dailyDosage: 'Once'
    });

    await component.save();

    expect(component.saving).toBeFalse();
  });

  it('should redirect if prescription not found in edit mode', async () => {
  const route = TestBed.inject(ActivatedRoute);

  spyOn(route.snapshot.paramMap, 'get').and.returnValue('123');

  mockService.getById.and.returnValue(of(null));

  await component.ngOnInit();

  expect(mockRouter.navigate).toHaveBeenCalled();
});

it('should patch form when editing existing prescription', async () => {
  const route = TestBed.inject(ActivatedRoute);

  spyOn(route.snapshot.paramMap, 'get').and.returnValue('123');

  mockService.getById.and.returnValue(of({
    patientId: 'p1',
    drugName: 'DrugX',
    startDate: '2026-01-01',
    durationDays: 2,
    dailyDosage: 'Once'
  }));

  await component.ngOnInit();

  expect(component.form.value.drugName).toBe('DrugX');
});

it('should calculate duration days correctly', () => {
  const result = (component as any).calculateDurationDays({
    startDate: '2026-01-01',
    endDate: '2026-01-03'
  });

  expect(result).toBe(3);
});

});