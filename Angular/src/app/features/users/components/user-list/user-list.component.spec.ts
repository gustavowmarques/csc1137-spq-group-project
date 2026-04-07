import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserListComponent } from './user-list.component';
import { UserService } from 'src/app/core/services/user.service';
import { of } from 'rxjs';

/* 🔥 STUB COMPONENT (IMPORTANT) */
@Component({
  selector: 'app-role-select',
  template: `<select [disabled]="disabled"></select>`
})
class MockRoleSelectComponent {
  @Input() value: any;
  @Input() disabled = false;
  @Output() roleChange = new EventEmitter<any>();
}

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: any;

  const mockUsers = [
    { uid: '1', displayName: 'John', email: 'john@test.com', role: 'Doctor' },
    { uid: '2', displayName: 'Jane', email: 'jane@test.com', role: 'Nurse' }
  ];

  beforeEach(async () => {
    mockUserService = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of(mockUsers)),
      updateRole: jasmine.createSpy('updateRole').and.resolveTo({}),
      approveEmail: jasmine.createSpy('approveEmail').and.resolveTo({})
    };

    await TestBed.configureTestingModule({
      declarations: [
        UserListComponent,
        MockRoleSelectComponent   // ✅ FIX
      ],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(mockUserService.getAll).toHaveBeenCalled();
    expect(component.users$).toBeDefined();
  });

  it('should call updateRole service', async () => {
    await component.changeRole('1', 'Admin');

    expect(mockUserService.updateRole).toHaveBeenCalledWith('1', 'Admin');
  });

  it('should set updating true while updating role', async () => {
    const promise = component.changeRole('1', 'Doctor');

    expect(component.updating['1']).toBeTrue();

    await promise;

    expect(component.updating['1']).toBeFalse();
  });

  it('should reset updating after success', async () => {
    await component.changeRole('2', 'Doctor');

    expect(component.updating['2']).toBeFalse();
  });

  it('should handle error and reset updating flag', async () => {
    mockUserService.updateRole.and.rejectWith('error');

    await component.changeRole('1', 'Doctor');

    expect(component.updating['1']).toBeFalse();
  });

  it('should render users in template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('John');
    expect(compiled.textContent).toContain('Jane');
  });

  it('should show error for invalid email', async () => {
  component.activationEmail = 'invalid-email';

  await component.activateEmail();

  expect(component.activationError).toBe('Enter a valid email address.');
});

it('should activate email successfully', async () => {
  component.activationEmail = 'test@test.com';

  await component.activateEmail();

  expect(mockUserService.approveEmail).toHaveBeenCalled();
  expect(component.activationMessage).toContain('Added');
});

it('should handle activation error', async () => {
  mockUserService.approveEmail.and.rejectWith('error');

  component.activationEmail = 'test@test.com';

  await component.activateEmail();

  expect(component.activationError).toBe('Failed to add email. Please try again.');
});

it('should disable add button when activating', () => {
  component.activating = true;
  fixture.detectChanges();

  const button = fixture.nativeElement.querySelector('.btn-activate');

  expect(button.disabled).toBeTrue();
});


it('should handle updateRole error', async () => {
  mockUserService.updateRole.and.rejectWith('error');

  await component.changeRole('1', 'Doctor');

  expect(component.updating['1']).toBeFalse();
});



it('should NOT disable role select for normal user', async () => {
  component.users$ = of([
    {
      uid: '1',
      displayName: 'User1',
      email: 'u@test.com',
      role: 'Doctor',
      createdAt: new Date()
    }
  ]);

  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  const select = fixture.nativeElement.querySelector('select');

  expect(select.disabled).toBeFalse();
});

});