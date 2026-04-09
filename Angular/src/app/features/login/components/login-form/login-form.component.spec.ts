import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      signInWithGoogle: jasmine.createSpy('signInWithGoogle')
    };

    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call signInWithGoogle', async () => {
    mockAuthService.signInWithGoogle.and.resolveTo({});

    await component.signInWithGoogle();

    expect(mockAuthService.signInWithGoogle).toHaveBeenCalled();
  });

  it('should set isAuthenticating true during login', async () => {
    let resolveFn: any;
    mockAuthService.signInWithGoogle.and.returnValue(
      new Promise((resolve) => {
        resolveFn = resolve;
      })
    );

    const promise = component.signInWithGoogle();

    expect(component.isAuthenticating).toBeTrue();

    resolveFn(); // finish promise
    await promise;

    expect(component.isAuthenticating).toBeFalse();
  });

  it('should set authError on failure', async () => {
    mockAuthService.signInWithGoogle.and.rejectWith(new Error('Login failed'));

    await component.signInWithGoogle();

    expect(component.authError).toBe('Login failed');
    expect(component.isAuthenticating).toBeFalse();
  });

  it('should set default error message for unknown error', async () => {
    mockAuthService.signInWithGoogle.and.rejectWith('random error');

    await component.signInWithGoogle();

    expect(component.authError).toContain('Google sign-in failed');
  });

  it('should clear previous error before login', async () => {
    component.authError = 'Old error';

    mockAuthService.signInWithGoogle.and.resolveTo({});

    await component.signInWithGoogle();

    expect(component.authError).toBe('');
  });

  it('should show "Signing in..." when loading', () => {
    component.isAuthenticating = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Signing in');
  });

  it('should display error message in UI', () => {
    component.authError = 'Login failed';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Login failed');
  });
});