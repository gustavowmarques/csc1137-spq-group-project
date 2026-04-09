import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let afAuthMock: any;
  let afsMock: any;
  let routerMock: any;

  let authState$: BehaviorSubject<any>;

  beforeEach(() => {
    authState$ = new BehaviorSubject(null);

    afAuthMock = {
      authState: authState$.asObservable(),
      signInWithPopup: jasmine.createSpy('signInWithPopup'),
      signOut: jasmine.createSpy('signOut').and.resolveTo({})
    };

    afsMock = {
      doc: jasmine.createSpy('doc')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: AngularFirestore, useValue: afsMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should set currentUser null when logged out', () => {
    authState$.next(null);

    expect(service.currentUser).toBeNull();
    expect(service.isLoggedIn).toBeFalse();
  });

  it('should return true for matching role', () => {
    (service as any).currentUserSubject.next({ role: 'Admin' });

    expect(service.hasRole('Admin')).toBeTrue();
  });

  it('should return true if user has any role', () => {
    (service as any).currentUserSubject.next({ role: 'Doctor' });

    expect(service.hasAnyRole('Admin', 'Doctor')).toBeTrue();
  });

  it('should sign out and navigate to login', async () => {
    await service.signOut();

    expect(afAuthMock.signOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should throw error if no email', async () => {
    afAuthMock.signInWithPopup.and.resolveTo({
      user: { email: null }
    });

    try {
      await service.signInWithGoogle();
      fail('Expected error');
    } catch (e: any) {
      expect(e.message).toContain('Unable to read');
    }
  });

  it('should block new unapproved user', async () => {
    afAuthMock.signInWithPopup.and.resolveTo({
      user: {
        email: 'test@test.com',
        delete: jasmine.createSpy('delete').and.resolveTo({})
      },
      additionalUserInfo: { isNewUser: true }
    });

    afsMock.doc.and.returnValue({
      valueChanges: () => of({ active: false })
    });

    try {
      await service.signInWithGoogle();
      fail('Expected error');
    } catch (e: any) {
      expect(e.message).toContain('authorise');
    }
  });

  it('should create new user and navigate', async () => {
    const userRefMock = {
      valueChanges: () => of(null),
      set: jasmine.createSpy('set').and.resolveTo({})
    };

    afAuthMock.signInWithPopup.and.resolveTo({
      user: {
        uid: '123',
        email: 'test@test.com',
        displayName: 'Test User'
      },
      additionalUserInfo: { isNewUser: false }
    });

    afsMock.doc.and.callFake((path: string) => {
      if (path.includes('approvedEmails')) {
        return { valueChanges: () => of({ active: true, role: 'Admin' }) };
      }
      return userRefMock;
    });

    await service.signInWithGoogle();

    expect(userRefMock.set).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should update existing user', async () => {
    const userRefMock = {
      valueChanges: () => of({ role: 'Doctor' }),
      update: jasmine.createSpy('update').and.resolveTo({})
    };

    afAuthMock.signInWithPopup.and.resolveTo({
      user: {
        uid: '123',
        email: 'test@test.com',
        displayName: 'Test User'
      },
      additionalUserInfo: { isNewUser: false }
    });

    afsMock.doc.and.callFake(() => userRefMock);

    await service.signInWithGoogle();

    expect(userRefMock.update).toHaveBeenCalled();
  });

  it('should fallback to set if update fails', async () => {
    const userRefMock = {
      valueChanges: () => of({ role: 'Doctor' }),
      update: jasmine.createSpy('update').and.rejectWith('error'),
      set: jasmine.createSpy('set').and.resolveTo({})
    };

    afAuthMock.signInWithPopup.and.resolveTo({
      user: {
        uid: '123',
        email: 'test@test.com',
        displayName: 'Test User'
      },
      additionalUserInfo: { isNewUser: false }
    });

    afsMock.doc.and.returnValue(userRefMock);

    await service.signInWithGoogle();

    expect(userRefMock.set).toHaveBeenCalled();
  });

});