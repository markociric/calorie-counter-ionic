import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  authorities?: string[];
}
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  username = '';
  password = '';
  passwordVisible = false;

  // spinner flag za iOS <ion-spinner>
  isSubmitting = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Molim unesite korisničko ime i lozinku.');
      return;
    }

    this.isSubmitting = true;

    // AuthService.login vraća Observable<LoginResponse>
    // ali da izbegnemo RxJS overload probleme -> koristimo subscribe(success, error)
    this.auth.login({ username: this.username, password: this.password }).subscribe(
      // SUCCESS
      (res: any) => {
        try {
          // token se već snima u AuthService preko tap(), ali ovde ga čitamo za role
          const decoded = jwtDecode<JwtPayload>(res.accessToken);
          const roles = decoded?.authorities || [];

          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/tabs/admin']);
          } else {
            this.router.navigate(['/dashboard-tabs/dashboard']);// standardni korisnik
          }
        } catch (e) {
          // fallback ako jwtDecode padne
          this.router.navigate(['/dashboard-tabs/dashboard']);
        } finally {
          this.isSubmitting = false;
        }
      },
      // ERROR
      () => {
        this.isSubmitting = false;
        alert('Login neuspešan');
      }
    );
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}