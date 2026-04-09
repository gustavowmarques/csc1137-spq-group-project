import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitFormComponent } from './visit-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VisitService } from 'src/app/core/services/visit.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('VisitFormComponent', () => {
  let component: VisitFormComponent;
  let fixture: ComponentFixture<VisitFormComponent>;

  let mockVisitService: any;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockVisitService = {
      getById: jasmine.createSpy('getById').and.returnValue(null),
      create: jasmine.createSpy('create').and.resolveTo({}),
      update: jasmine.createSpy('update').and.resolveTo({}),
      delete: jasmine.createSpy('delete').and.resolveTo({})
    };

    mockAuthService = {
      currentUser: { uid: 'user123' }
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [VisitFormComponent],
      providers: [
        { provide: VisitService, useValue: mockVisitService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              },
              queryParamMap: {
                get: () => 'patient123'
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with notes control', () => {
    expect(component.form.contains('visitDate')).toBeTrue();
    expect(component.form.contains('notes')).toBeTrue();
  });

  it('should be invalid when notes is empty', () => {
    component.form.setValue({ visitDate: component.today, notes: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('should be valid when notes provided', () => {
    component.form.setValue({ visitDate: component.today, notes: 'Patient is stable' });
    expect(component.form.valid).toBeTrue();
  });

  it('should not call create if form invalid', async () => {
    component.form.setValue({ visitDate: component.today, notes: '' });

    await component.save();

    expect(mockVisitService.create).not.toHaveBeenCalled();
  });

  it('should create visit and navigate', async () => {
    component.form.setValue({ visitDate: component.today, notes: 'Patient improving' });

    await component.save();

    expect(mockVisitService.create).toHaveBeenCalledWith({
      patientId: 'patient123',
      visitDate: component.today,
      notes: 'Patient improving',
      createdBy: 'user123'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/visits'],
      { queryParams: { patientId: 'patient123' } }
    );
  });

  it('should redirect if no patientId', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, 'get').and.returnValue(null);

    const fixture2 = TestBed.createComponent(VisitFormComponent);
    const comp2 = fixture2.componentInstance;

    comp2.form = comp2['fb'].group({
      visitDate: [''],
      notes: ['']
    });

    fixture2.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/patients']);
  });
});