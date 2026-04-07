import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitFormComponent } from './visit-form.component';
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
      create: jasmine.createSpy('create').and.resolveTo({})
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
              queryParamMap: {
                get: () => 'patient123'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with notes control', () => {
    expect(component.form.contains('notes')).toBeTrue();
  });

  it('should be invalid when notes is empty', () => {
    component.form.setValue({ notes: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('should be valid when notes provided', () => {
    component.form.setValue({ notes: 'Patient is stable' });
    expect(component.form.valid).toBeTrue();
  });

  it('should not call create if form invalid', async () => {
    component.form.setValue({ notes: '' });

    await component.save();

    expect(mockVisitService.create).not.toHaveBeenCalled();
  });

  it('should create visit and navigate', async () => {
    component.form.setValue({ notes: 'Patient improving' });

    await component.save();

    expect(mockVisitService.create).toHaveBeenCalledWith({
      patientId: 'patient123',
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
      notes: ['']
    });

    fixture2.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/patients']);
  });
});