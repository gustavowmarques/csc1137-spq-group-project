import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUser } from '../../core/models/user.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  currentUser$!: Observable<AppUser | null>;
  isAdmin$!: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
    this.isAdmin$ = this.currentUser$.pipe(
      map(user => user?.role === 'Admin')
    );
  }

  signOut(): void {
    this.authService.signOut();
  }
}
