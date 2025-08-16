import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  username = '';
  password = '';

  // spinner flag (za iOS <ion-spinner>)
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Molim unesite korisničko ime i lozinku.');
      return;
    }

    this.isSubmitting = true;

    this.auth.register({ username: this.username, password: this.password }).subscribe(
      (res) => {
        this.isSubmitting = false;
        alert('Uspešna registracija');
        this.router.navigate(['/login']);
      },
      () => {
        this.isSubmitting = false;
        alert('Registracija nije uspela');
      }
    );
  }

  ngOnInit() { }
}
