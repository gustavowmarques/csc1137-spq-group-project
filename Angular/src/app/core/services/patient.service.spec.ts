import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('PatientService', () => {
  let service: PatientService;
  let afsMock: any;

  beforeEach(() => {
    afsMock = {
      collection: jasmine.createSpy('collection'),
      doc: jasmine.createSpy('doc')
    };

    TestBed.configureTestingModule({
      providers: [
        PatientService,
        { provide: AngularFirestore, useValue: afsMock }
      ]
    });

    service = TestBed.inject(PatientService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all patients', (done) => {
    const mockSnapshot = [
      {
        payload: {
          doc: {
            id: '1',
            data: () => ({ firstName: 'John', lastName: 'Doe' })
          }
        }
      }
    ];

    afsMock.collection.and.returnValue({
      snapshotChanges: () => of(mockSnapshot)
    });

    service.getAll().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].id).toBe('1');
      done();
    });
  });

  it('should return patient by id', (done) => {
    afsMock.doc.and.returnValue({
      valueChanges: () => of({ firstName: 'John', lastName: 'Doe' })
    });

    service.getById('1').subscribe(res => {
      expect(res?.id).toBe('1');
      done();
    });
  });

  it('should return undefined if no patient', (done) => {
    afsMock.doc.and.returnValue({
      valueChanges: () => of(undefined)
    });

    service.getById('1').subscribe(res => {
      expect(res).toBeUndefined();
      done();
    });
  });

  it('should create patient', async () => {
    const addSpy = jasmine.createSpy('add').and.resolveTo({ id: '123' });

    afsMock.collection.and.returnValue({ add: addSpy });

    const id = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      ppsn: '123'
    } as any);

    expect(id).toBe('123');
    expect(addSpy).toHaveBeenCalled();
  });

  it('should update patient', async () => {
    const updateSpy = jasmine.createSpy('update').and.resolveTo({});

    afsMock.doc.and.returnValue({ update: updateSpy });

    await service.update('1', { firstName: 'Updated' });

    expect(updateSpy).toHaveBeenCalled();
  });

  it('should return false if ppsn empty', async () => {
    const result = await service.isPpsnTaken('');
    expect(result).toBeFalse();
  });

  it('should return true if ppsn exists', async () => {
    afsMock.collection.and.returnValue({
      get: () => of({
        docs: [{ id: '1' }]
      })
    });

    const result = await service.isPpsnTaken('abc');

    expect(result).toBeTrue();
  });

  it('should ignore excluded id', async () => {
    afsMock.collection.and.returnValue({
      get: () => of({
        docs: [{ id: '1' }]
      })
    });

    const result = await service.isPpsnTaken('abc', '1');

    expect(result).toBeFalse();
  });

  it('should filter patients by name', (done) => {
    spyOn(service, 'getAll').and.returnValue(of([
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' }
    ] as any));

    service.searchByName('john').subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].firstName).toBe('John');
      done();
    });
  });

});