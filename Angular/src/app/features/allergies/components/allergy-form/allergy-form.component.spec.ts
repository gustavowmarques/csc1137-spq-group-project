import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllergyFormComponent } from './allergy-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AllergyService } from 'src/app/core/services/allergy.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AllergyFormComponent', () => {
  let component: AllergyFormComponent;
  let fixture: ComponentFixture<AllergyFormComponent>;
  let mockService: any;
  let mockRouter: any;
  let mockRoute: any;

  beforeEach(async () => {
    mockService = {
      create: jasmine.createSpy().and.returnValue(Promise.resolve())
    };

    mockRouter = {
      navigate: jasmine.createSpy()
    };

    mockRoute = {
      snapshot: {
        queryParamMap: {
          get: jasmine.createSpy().and.returnValue('p123')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [AllergyFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AllergyService, useValue: mockService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AllergyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.value).toEqual({
      allergen: '',
      severity: 'Mild'
    });
  });

  it('should get patientId from query params', () => {
    expect(component.patientId).toBe('p123');
  });

  it('should redirect if patientId is missing', () => {
    mockRoute.snapshot.queryParamMap.get.and.returnValue(null);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/patients']);
  });

  it('should not call service if form is invalid', async () => {
    component.form.setValue({
      allergen: '',
      severity: 'Mild'
    });

    await component.save();

    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('should mark form as touched when invalid', async () => {
    spyOn(component.form, 'markAllAsTouched');

    component.form.setValue({
      allergen: '',
      severity: 'Mild'
    });

    await component.save();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call service on valid form', async () => {
    component.form.setValue({
      allergen: 'Peanuts',
      severity: 'Severe'
    });

    await component.save();

    expect(mockService.create).toHaveBeenCalledWith({
      patientId: 'p123',
      allergen: 'Peanuts',
      severity: 'Severe'
    });
  });

  it('should navigate after successful save', async () => {
    component.form.setValue({
      allergen: 'Dust',
      severity: 'Mild'
    });

    await component.save();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/allergies'],
      { queryParams: { patientId: 'p123' } }
    );
  });

  it('should toggle saving flag correctly', async () => {
    component.form.setValue({
      allergen: 'Pollen',
      severity: 'Mild'
    });

    const promise = component.save();

    expect(component.saving).toBeTrue();

    await promise;

    expect(component.saving).toBeFalse();
  });

});