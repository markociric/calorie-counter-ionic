import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

interface JwtPayload {
  sub: string;
  role?: string;
  authorities?: string[];
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone:false,
})
export class ProfilePage implements OnInit {
  username = '';
  role = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.decodeToken(token);
  }

  private decodeToken(token: string) {
    try {
      const payloadBase64 = token.split('.')[1];
      const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload: JwtPayload = JSON.parse(json);

      this.username = payload.sub;
      if (payload.role) {
        this.role = payload.role;
      } else if (payload.authorities?.length) {
        this.role = payload.authorities[0];
      }
    } catch (e) {
      console.error('Neuspešno dekodiranje tokena', e);
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Potvrda',
      message: 'Da li ste sigurni da želite da se odjavite?',
      buttons: [
        {
          text: 'Otkaži',
          role: 'cancel'
        },
        {
          text: 'Odjavi se',
          role: 'confirm',
          handler: () => {
            this.auth.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}
