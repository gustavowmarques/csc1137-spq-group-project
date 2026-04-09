import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { RoleSelectComponent } from './components/role-select/role-select.component';

@NgModule({
  declarations: [UserListComponent, RoleSelectComponent],
  imports: [CommonModule, UsersRoutingModule]
})
export class UsersModule { }
