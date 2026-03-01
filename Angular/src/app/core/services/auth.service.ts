import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$: Observable<AppUser | null> = this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        const userRef = this.afs.doc<AppUser>(`users/${firebaseUser.uid}`);
        (async () => {
          try {
            const snap = await userRef.ref.get({ source: 'server' });
            const serverUser = snap.exists ? (snap.data() as AppUser) : null;
            this.currentUserSubject.next(serverUser);
          } catch (err) {
            const local = await firstValueFrom(userRef.valueChanges().pipe(take(1)));
            this.currentUserSubject.next(local ?? null);
          }
        })();
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  get currentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(...roles: UserRole[]): boolean {
    return roles.includes(this.currentUser?.role as UserRole);
  }

  async signInWithGoogle(): Promise<void> {
    const credential = await this.afAuth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );

    if (credential.user) {
      const user = credential.user;
      const uid = user.uid;
      const userRef = this.afs.doc<AppUser>(`users/${uid}`);

      const existing = await firstValueFrom(userRef.valueChanges());

      if (existing) {
        await userRef.update({
          email: user.email ?? existing.email,
          displayName: user.displayName ?? existing.displayName
        }).catch(async () => {
          await userRef.set({
            uid,
            email: user.email ?? '',
            displayName: user.displayName ?? '',
            role: existing.role ?? 'Nurse',
            createdAt: existing.createdAt ?? new Date()
          }, { merge: true });
        });
      } else {
        await userRef.set({
          uid,
          email: user.email ?? '',
          displayName: user.displayName ?? '',
          role: 'Nurse',
          createdAt: new Date()
        }, { merge: true });
      }

      const role = existing?.role ?? 'Nurse';
      this.router.navigate([role === 'Admin' ? '/users' : '/patients']);
    }
  }

  async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
