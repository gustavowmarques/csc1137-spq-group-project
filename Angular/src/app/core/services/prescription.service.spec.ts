import { TestBed } from '@angular/core/testing';
import { PrescriptionService } from './prescription.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AllergyService } from './allergy.service';
import { of } from 'rxjs';

describe('PrescriptionService', () => {
  let service: PrescriptionService;
  let afsMock: any;
  let allergyServiceMock: any;

  beforeEach(() => {
    afsMock = {
      collection: jasmine.createSpy().and.callFake(() => ({
        add: jasmine.createSpy().and.resolveTo({ id: '123' }),
        snapshotChanges: jasmine.createSpy().and.returnValue(
          of([
            {
              payload: {
                doc: {
                  id: '1',
                  data: () => ({
                    drugName: 'Aspirin',
                    startDate: '2026-03-01',
                    endDate: '2026-12-30',
                    createdAt: new Date()
                  })
                }
              }
            }
          ])
        )
      }))
    };

    allergyServiceMock = {
      getByPatientId: jasmine.createSpy().and.returnValue(of([]))
    };

    TestBed.configureTestingModule({
      providers: [
        PrescriptionService,
        { provide: AngularFirestore, useValue: afsMock },
        { provide: AllergyService, useValue: allergyServiceMock }
      ]
    });

    service = TestBed.inject(PrescriptionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return prescriptions', (done) => {
    service.getByPatientId('p1').subscribe((res) => {
      expect(res.length).toBeGreaterThan(0);
      expect(res[0].id).toBe('1');
      done();
    });

    expect(afsMock.collection).toHaveBeenCalled();
  });

  it('should filter active prescriptions', (done) => {
    service.getActiveByPatientId('p1').subscribe((res) => {
      expect(res.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return empty array if no conflicts', async () => {
    spyOn(service, 'getByPatientId').and.returnValue(of([]));

    const result = await service.checkDrugConflicts(
      'p1',
      'Aspirin',
      '2026-03-01',
      '2026-03-10'
    );

    expect(result.length).toBe(0);
  });


it('should detect drug conflicts', async () => {
  spyOn(service, 'getByPatientId').and.returnValue(
    of([
      {
        drugName: 'Warfarin',
        startDate: '2026-03-01',
        endDate: '2026-03-30'
      }
    ] as any)
  );

  const result = await service.checkDrugConflicts(
    'p1',
    'aspirin', // lowercase important
    '2026-03-10',
    '2026-03-20'
  );

  expect(result.length).toBeGreaterThan(0);
});

  it('should return null if no allergy', async () => {
    allergyServiceMock.getByPatientId.and.returnValue(of([]));

    const result = await service.checkAllergyBlock('p1', 'Aspirin');

    expect(result).toBeNull();
  });

  it('should return allergen if severe allergy exists', async () => {
    allergyServiceMock.getByPatientId.and.returnValue(
      of([
        {
          allergen: 'aspirin',
          severity: 'Severe'
        }
      ])
    );

    const result = await service.checkAllergyBlock('p1', 'Aspirin');

    expect(result).toBe('aspirin');
  });

  it('should create prescription and return id', async () => {
    const result = await service.create({
      patientId: 'p1',
      drugName: 'Aspirin',
      startDate: '2026-03-01',
      endDate: '2026-03-10'
    } as any);

    expect(result).toBe('123');
    expect(afsMock.collection).toHaveBeenCalled();
  });
});