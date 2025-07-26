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
  standalone:false,
})
export class LoginPage {
username = '';
  password = '';
  passwordVisible = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Molim unesite korisničko ime i lozinku.');
      return;
    }

    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (res: LoginResponse) => {
          // Sačuvaj tokene
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          if (res.refreshTokenExpiry) {
            localStorage.setItem('refreshTokenExpiry', res.refreshTokenExpiry);
          }

          // Dekodiraj JWT i izvuci role
          const decoded = jwtDecode<JwtPayload>(res.accessToken);
          const roles = decoded.authorities || [];

          // Preusmeri na /admin ili /dashboard
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          alert('Login neuspešan');
        },
      });
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}