import { Component, OnInit } from '@angular/core';
import { UserService, AppUser } from '../../services/user.service';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone:false,
})
export class AdminPage implements OnInit {
  users: AppUser[] = [];
  constructor(private userService: UserService, private auth: AuthService,
    private navCtrl: NavController) {

  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (list) => (this.users = list),
      error: (err) => console.error('Greška pri učitavanju korisnika', err),
    });
  }
logout() {
    // Obriši credentiale iz lokalnog skladišta
    this.auth.logout();             // ili localStorage.clear() u zavisnosti od tvog servisa
    // Vratimo se na login kao koren aplikacije
    this.navCtrl.navigateRoot('/login');
  }
}
