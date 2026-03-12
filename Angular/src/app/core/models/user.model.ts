// availble roles in the portal
export type UserRole = 'Admin' | 'Doctor' | 'Nurse';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
}