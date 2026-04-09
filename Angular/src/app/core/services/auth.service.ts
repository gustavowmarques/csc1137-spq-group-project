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
  // holds the current logged in user
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$: Observable<AppUser | null> = this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // listen to firebase and fetch user from firestore
    this.afAuth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        const userRef = this.afs.doc<AppUser>(`users/${firebaseUser.uid}`);
        (async () => {
          try {
            const snap = await userRef.ref.get({ source: 'server' });
            const serverUser = snap.exists ? (snap.data() as AppUser) : null;
            this.currentUserSubject.next(serverUser);
          } catch (err) {
            // fallback to local cache if server fetch fails
            const local = await firstValueFrom(userRef.valueChanges().pipe(take(1)));
            this.currentUserSubject.next(local ?? null);
          }
        })();
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  // return current user
  get currentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // check if logged in user has a specifc role
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(...roles: UserRole[]): boolean {
    return roles.includes(this.currentUser?.role as UserRole);
  }

  // sign in with google
  async signInWithGoogle(): Promise<void> {
    const credential = await this.afAuth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );

    const firebaseUser = credential.user;
    if (!firebaseUser?.email) {
      await this.afAuth.signOut();
      throw new Error('Unable to read your Google account email.');
    }

    const normalisedEmail = firebaseUser.email.trim().toLowerCase();
    const approvalRef = this.afs.doc<{ active: boolean; role: UserRole }>(`approvedEmails/${normalisedEmail}`);
    const approval = await firstValueFrom(approvalRef.valueChanges());
    const approvedRole: UserRole = approval?.role ?? 'Nurse';

    if (credential.additionalUserInfo?.isNewUser && !approval?.active) {
      try {
        await firebaseUser.delete();
      } catch {
        await this.afAuth.signOut();
      }

      throw new Error('Please contact an admin to authorise your account.');
    }

    if (firebaseUser) {
      const user = firebaseUser;
      const uid = user.uid;
      const userRef = this.afs.doc<AppUser>(`users/${uid}`);

      const existing = await firstValueFrom(userRef.valueChanges());
      const role = existing?.role ?? approvedRole;
      const effectiveUser: AppUser = {
        uid,
        email: user.email ?? existing?.email ?? '',
        displayName: user.displayName ?? existing?.displayName ?? '',
        role,
        createdAt: existing?.createdAt ?? new Date()
      };

      // update exisiting user or create new with nurse role
      if (existing) {
        await userRef.update({
          email: effectiveUser.email,
          displayName: effectiveUser.displayName
        }).catch(async () => {
          await userRef.set(effectiveUser, { merge: true });
        });
      } else {
        await userRef.set(effectiveUser, { merge: true });
      }
      this.currentUserSubject.next(effectiveUser);

      // role-based redirection post login
      this.router.navigate([role === 'Admin' ? '/users' : '/patients']);
    }
  }

  // sign out and redirct to login page
  async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}