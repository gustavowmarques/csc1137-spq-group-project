import { TestBed } from '@angular/core/testing';
import { VisitService } from './visit.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('VisitService', () => {
  let service: VisitService;
  let afsMock: any;

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
                    patientId: 'p1',
                    notes: 'Patient is stable',
                    createdAt: new Date()
                  })
                }
              }
            }
          ])
        )
      }))
    };

    TestBed.configureTestingModule({
      providers: [
        VisitService,
        { provide: AngularFirestore, useValue: afsMock }
      ]
    });

    service = TestBed.inject(VisitService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return visits for patient', (done) => {
    service.getByPatientId('p1').subscribe((res) => {
      expect(res.length).toBeGreaterThan(0);
      expect(res[0].id).toBe('1');
      expect(res[0].notes).toBe('Patient is stable');
      done();
    });

    expect(afsMock.collection).toHaveBeenCalled();
  });

  it('should create visit and return id', async () => {
    const result = await service.create({
      patientId: 'p1',
      notes: 'Test visit'
    } as any);

    expect(result).toBe('123');
    expect(afsMock.collection).toHaveBeenCalled();
  });
});