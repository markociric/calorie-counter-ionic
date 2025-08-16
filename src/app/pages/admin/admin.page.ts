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
    isLoadingUsers = false;
  constructor(private userService: UserService, private auth: AuthService,
    private navCtrl: NavController) {

  }

   ngOnInit() {
  this.isLoadingUsers = true;

  // simuliramo kašnjenje od 2 sekunde
  setTimeout(() => {
    this.userService.getAllUsers().subscribe({
      next: (list) => {
        this.users = list;
        this.isLoadingUsers = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju korisnika', err);
        this.isLoadingUsers = false;
      },
    });
  }, 1000); // 2000ms
}

logout() {
    // Obriši credentiale iz lokalnog skladišta
    this.auth.logout();             // ili localStorage.clear() u zavisnosti od tvog servisa
    // Vratimo se na login kao koren aplikacije
    this.navCtrl.navigateRoot('/login');
  }
}
