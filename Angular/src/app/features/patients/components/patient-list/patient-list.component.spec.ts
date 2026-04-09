import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientListComponent } from './patient-list.component';
import { of } from 'rxjs';
import { PatientService } from 'src/app/core/services/patient.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;
  let mockPatientService: any;
  let mockAuthService: any;

  const mockPatients = [
    { id: '1', firstName: 'John', lastName: 'Doe', dateOfBirth: '2000-01-01' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1995-05-05' }
  ];

  beforeEach(async () => {
    mockPatientService = {
      getAll: jasmine.createSpy().and.returnValue(of(mockPatients)),
      searchByName: jasmine.createSpy().and.returnValue(of([mockPatients[0]]))
    };

    mockAuthService = {
      hasAnyRole: jasmine.createSpy().and.returnValue(true)
    };

    await TestBed.configureTestingModule({
      declarations: [PatientListComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore routerLink errors
    }).compileComponents();

    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set canEdit based on roles', () => {
    expect(mockAuthService.hasAnyRole).toHaveBeenCalledWith('Doctor', 'Admin');
    expect(component.canEdit).toBeTrue();
  });

  it('should call getAll on init when no search term', () => {
    expect(mockPatientService.getAll).toHaveBeenCalled();
  });

  it('should call searchByName when search term is entered', () => {
    component.onSearch('John');
    fixture.detectChanges();

    expect(mockPatientService.searchByName).toHaveBeenCalledWith('John');
  });

  it('should call getAll when search term is empty', () => {
    component.onSearch('');
    fixture.detectChanges();

    expect(mockPatientService.getAll).toHaveBeenCalled();
  });

  it('should render patient rows', () => {
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should show empty message when no patients', () => {
    mockPatientService.getAll.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.empty');
    expect(empty).toBeTruthy();
  });

  it('should show new patient button when canEdit is true', () => {
    const btn = fixture.nativeElement.querySelector('.btn-primary');
    expect(btn).toBeTruthy();
  });

  it('should NOT show new patient button if user has no role', () => {
  mockAuthService.hasAnyRole.and.returnValue(false);

  component.ngOnInit();
  fixture.detectChanges();

  const btn = fixture.nativeElement.querySelector('.btn-primary');
  expect(btn).toBeNull();
});

});