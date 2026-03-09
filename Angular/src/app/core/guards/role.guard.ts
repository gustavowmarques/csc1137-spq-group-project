import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  // check if user has a valid role for this route
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const allowedRoles = route.data['roles'] as UserRole[];

    return this.afAuth.authState.pipe(
      take(1),
      switchMap(firebaseUser => {
        if (!firebaseUser) {
          this.router.navigate(['/login']);
          return of(false);
        }
        return this.afs.doc<AppUser>(`users/${firebaseUser.uid}`).valueChanges().pipe(
          take(1),
          // allow if user has a valid role, else redirect to patients page
          map(user => {
            if (user && allowedRoles.includes(user.role)) {
              return true;
            }
            this.router.navigate(['/patients']);
            return false;
          })
        );
      })
    );
  }
}