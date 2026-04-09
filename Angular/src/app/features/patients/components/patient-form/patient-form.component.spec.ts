import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientFormComponent } from './patient-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PatientService } from 'src/app/core/services/patient.service';

describe('PatientFormComponent', () => {
  let component: PatientFormComponent;
  let fixture: ComponentFixture<PatientFormComponent>;
  let mockService: any;
  let routerSpy: any;

  beforeEach(async () => {

    mockService = {
      getById: jasmine.createSpy().and.returnValue(of({
        ppsn: '1234567A',
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '2000-01-01',
        gender: 'M',
        phoneNumber: '+3531234567',
        address: 'Dublin',
        bloodGroup: 'O+',
        emergencyContactName: 'Jane',
        emergencyContactNumber: '+3539876543'
      })),
      create: jasmine.createSpy().and.resolveTo({}),
      update: jasmine.createSpy().and.resolveTo({}),
      isPpsnTaken: jasmine.createSpy().and.resolveTo(false) // 🔥 IMPORTANT
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PatientFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PatientService, useValue: mockService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null // default = create mode
              }
            }
          }
        },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 🔹 Helper valid form data
  const validFormData = {
    ppsn: '1234567A',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2000-01-01',
    gender: 'M',
    phoneNumber: '+3531234567',
    address: 'Dublin',
    bloodGroup: 'O+',
    emergencyContactName: 'Jane',
    emergencyContactNumber: '+3539876543'
  };

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('firstName')?.value).toBe('');
  });

  it('should mark form invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should be valid when all fields are filled correctly', () => {
    component.form.setValue(validFormData);
    expect(component.form.valid).toBeTrue();
  });

  it('should return error for future date', () => {
    const control: any = { value: '2999-01-01' };
    const result = component.notFutureDate(control);
    expect(result).toEqual({ futureDate: true });
  });

  it('should call create service on save', async () => {
    component.form.setValue(validFormData);

    await component.save();

    expect(mockService.isPpsnTaken).toHaveBeenCalled();
    expect(mockService.create).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/patients']);
  });

  it('should not call service if form invalid', async () => {
    await component.save();

    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('should load patient in edit mode', () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap.get = () => '123';

    component.ngOnInit();

    expect(mockService.getById).toHaveBeenCalledWith('123');
    expect(component.isEdit).toBeTrue();
  });

  it('should call update service in edit mode', async () => {
    component.isEdit = true;
    component.patientId = '123';

    component.form.setValue(validFormData);

    await component.save();

    expect(mockService.update).toHaveBeenCalledWith('123', jasmine.any(Object));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/patients']);
  });

  it('should set error if PPSN already exists', async () => {
    mockService.isPpsnTaken.and.resolveTo(true);

    component.form.setValue(validFormData);

    await component.save();

    const ppsnControl = component.form.get('ppsn');
    expect(ppsnControl?.errors?.['duplicate']).toBeTrue();
    expect(mockService.create).not.toHaveBeenCalled();
  });

});