import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserRole } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-role-select',
  styles: [
    `
      select {
        padding: 6px 10px;
        background: #2a2a2a;
        color: #e0e0e0;
        border: 1px solid #444;
        border-radius: 6px;
        cursor: pointer;
      }

      select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `
  ],
  template: `
    <select
      [value]="value"
      [class]="cssClass"
      [disabled]="disabled"
      (change)="onChange($any($event.target).value)"
    >
      <option value="Doctor">Doctor</option>
      <option value="Nurse">Nurse</option>
      <option value="Admin">Admin</option>
    </select>
  `
})
export class RoleSelectComponent {
  @Input() value: UserRole = 'Nurse';
  @Input() disabled = false;
  @Input() cssClass = '';
  @Output() roleChange = new EventEmitter<UserRole>();

  onChange(role: UserRole): void {
    this.roleChange.emit(role);
  }
}