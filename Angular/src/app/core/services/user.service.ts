import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private afs: AngularFirestore) {}

  // get all users from firestore
  getAll(): Observable<AppUser[]> {
    return this.afs.collection<AppUser>('users').valueChanges();
  }

  // get a single user
  getById(uid: string): Observable<AppUser | undefined> {
    return this.afs.doc<AppUser>(`users/${uid}`).valueChanges();
  }

  // update a user's role
  async updateRole(uid: string, role: UserRole): Promise<void> {
    await this.afs.doc(`users/${uid}`).update({ role });
  }

  // approve an email for first-time login
  async approveEmail(email: string, role: UserRole): Promise<void> {
    const normalisedEmail = email.trim().toLowerCase();

    await this.afs.doc(`approvedEmails/${normalisedEmail}`).set({
      email: normalisedEmail,
      role,
      active: true,
      activatedAt: new Date()
    }, { merge: true });
  }
}
