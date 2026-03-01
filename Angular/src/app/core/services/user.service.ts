import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private afs: AngularFirestore) {}

  getAll(): Observable<AppUser[]> {
    return this.afs.collection<AppUser>('users').valueChanges();
  }

  getById(uid: string): Observable<AppUser | undefined> {
    return this.afs.doc<AppUser>(`users/${uid}`).valueChanges();
  }

  async updateRole(uid: string, role: UserRole): Promise<void> {
    await this.afs.doc(`users/${uid}`).update({ role });
  }
}
