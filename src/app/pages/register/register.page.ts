import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false,
})
export class RegisterPage implements OnInit {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Popunite sva polja.');
      return;
    }

    this.auth.register({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        alert('Uspešna registracija');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Registracija nije uspela');
      },
    });
  }

  ngOnInit() {
  }

}
