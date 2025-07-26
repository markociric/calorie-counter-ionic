// src/app/pages/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string;             // Subject, obično username
  authorities?: string[];   // Lista rola (ali tu bude samo jedna)
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  username = '';
  role = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('🟢 ProfilePage učitan');
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        this.username = decoded.sub ?? '';
        // uzimamo samo prvu ili jedinu rolu
        this.role = (decoded.authorities && decoded.authorities[0]) ?? '';
      } catch (e) {
        console.error('Neuspešno dekodiranje tokena', e);
      }
    }
  }
  onContentClick() {
    console.log('🔵 ion-content je kliknut');
  }
  private afterLogout() {
    // Očisti sve lokalne podatke
    localStorage.clear();
    // Preusmeri na login
    this.router.navigate(['/login']);
  }
}
