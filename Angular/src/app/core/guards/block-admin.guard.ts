import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class BlockAdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.currentUser$.pipe(
      filter(user => user !== null),
      take(1),
      map(user => {
        if (user?.role === 'Admin') {
          this.router.navigate(['/users']);
          return false;
        }
        return true;
      })
    );
  }
}
