import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        if (!res) return;
        // TODO: Sačuvaj token ako backend šalje
        this.router.navigate(['/dashboard']);
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
