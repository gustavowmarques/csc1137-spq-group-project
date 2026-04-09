import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let afsMock: any;

  beforeEach(() => {
    afsMock = {
      collection: jasmine.createSpy('collection'),
      doc: jasmine.createSpy('doc')
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AngularFirestore, useValue: afsMock }
      ]
    });

    service = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return all users', (done) => {
    const mockUsers = [
      { uid: '1', email: 'a@test.com', role: 'Admin' }
    ];

    afsMock.collection.and.returnValue({
      valueChanges: () => of(mockUsers)
    });

    service.getAll().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].email).toBe('a@test.com');
      done();
    });
  });

  it('should return user by id', (done) => {
    const mockUser = { uid: '1', email: 'a@test.com', role: 'Doctor' };

    afsMock.doc.and.returnValue({
      valueChanges: () => of(mockUser)
    });

    service.getById('1').subscribe(res => {
      expect(res?.uid).toBe('1');
      done();
    });
  });

  it('should return undefined if user not found', (done) => {
    afsMock.doc.and.returnValue({
      valueChanges: () => of(undefined)
    });

    service.getById('1').subscribe(res => {
      expect(res).toBeUndefined();
      done();
    });
  });

  it('should update user role', async () => {
    const updateSpy = jasmine.createSpy('update').and.resolveTo({});

    afsMock.doc.and.returnValue({
      update: updateSpy
    });

    await service.updateRole('1', 'Admin');

    expect(afsMock.doc).toHaveBeenCalledWith('users/1');
    expect(updateSpy).toHaveBeenCalledWith({ role: 'Admin' });
  });

  it('should approve email with normalized format', async () => {
    const setSpy = jasmine.createSpy('set').and.resolveTo({});

    afsMock.doc.and.returnValue({
      set: setSpy
    });

    await service.approveEmail('TEST@MAIL.COM ', 'Doctor');

    expect(afsMock.doc).toHaveBeenCalledWith('approvedEmails/test@mail.com');
    expect(setSpy).toHaveBeenCalled();

    const args = setSpy.calls.mostRecent().args[0];

    expect(args.email).toBe('test@mail.com');
    expect(args.role).toBe('Doctor');
    expect(args.active).toBeTrue();
    expect(args.activatedAt).toBeTruthy();
  });

  it('should call set with merge true', async () => {
    const setSpy = jasmine.createSpy('set').and.resolveTo({});

    afsMock.doc.and.returnValue({
      set: setSpy
    });

    await service.approveEmail('a@test.com', 'Nurse');

    expect(setSpy).toHaveBeenCalledWith(jasmine.any(Object), { merge: true });
  });

});