import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
// login page component with google sign in
export class LoginFormComponent {
  isAuthenticating = false;
  authError = '';

  constructor(private authService: AuthService) {}

  async signInWithGoogle(): Promise<void> {
    this.authError = '';
    this.isAuthenticating = true;

    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error(error);
      this.authError = error instanceof Error
        ? error.message
        : 'Google sign-in failed. Please try again.';
    } finally {
      this.isAuthenticating = false;
    }
  }
}
