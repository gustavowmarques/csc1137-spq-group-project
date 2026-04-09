import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser, UserRole } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
// admin view for managing user accounts and roles
export class UserListComponent implements OnInit {
  users$!: Observable<AppUser[]>;
  updating: Record<string, boolean> = {};
  activationEmail = '';
  activationRole: UserRole = 'Nurse';
  activating = false;
  activationMessage = '';
  activationError = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users$ = this.userService.getAll();
  }

  // update user role
  async changeRole(uid: string, role: UserRole): Promise<void> {
    this.updating[uid] = true;
    try {
      await this.userService.updateRole(uid, role);
    } catch (err) {
      console.error('Failed to update role', err);
    } finally {
      this.updating[uid] = false;
    }
  }

  async activateEmail(): Promise<void> {
    this.activationMessage = '';
    this.activationError = '';

    const email = this.activationEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      this.activationError = 'Enter a valid email address.';
      return;
    }

    this.activating = true;
    try {
      await this.userService.approveEmail(email, this.activationRole);
      this.activationMessage = `Added ${email} as ${this.activationRole}.`;
      this.activationEmail = '';
      this.activationRole = 'Nurse';
    } catch (err) {
      this.activationError = 'Failed to add email. Please try again.';
    } finally {
      this.activating = false;
    }
  }
}