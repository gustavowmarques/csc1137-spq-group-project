import { TestBed } from '@angular/core/testing';
import { AllergyService } from './allergy.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('AllergyService', () => {
  let service: AllergyService;
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
                    name: 'Peanut',
                    severity: 'High',
                    createdAt: new Date()
                  })
                }
              }
            }
          ])
        )
      })),
      doc: jasmine.createSpy().and.returnValue({
        delete: jasmine.createSpy().and.resolveTo()
      })
    };

    TestBed.configureTestingModule({
      providers: [
        AllergyService,
        { provide: AngularFirestore, useValue: afsMock }
      ]
    });

    service = TestBed.inject(AllergyService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return allergies for patient', (done) => {
    service.getByPatientId('p1').subscribe((result) => {
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('1');
      done();
    });

    expect(afsMock.collection).toHaveBeenCalled();
  });

  it('should create allergy and return id', async () => {
    const result = await service.create({
      patientId: 'p1',
      name: 'Dust',
      severity: 'Low'
    } as any);

    expect(result).toBe('123');
    expect(afsMock.collection).toHaveBeenCalled();
  });

  it('should delete allergy', async () => {
    await service.delete('123');

    expect(afsMock.doc).toHaveBeenCalledWith('allergies/123');
  });
});