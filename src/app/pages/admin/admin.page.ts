import { Component, OnInit } from '@angular/core';
import { UserService, AppUser } from '../../services/user.service';

import { addIcons } from 'ionicons';
import { library, playCircle, radio, search } from 'ionicons/icons';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone:false,
})
export class AdminPage implements OnInit {
  users: AppUser[] = [];
  constructor(private userService: UserService) {
    /**
     * Any icons you want to use in your application
     * can be registered in app.component.ts and then
     * referenced by name anywhere in your application.
     */
    addIcons({ library, playCircle, radio, search });
  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (list) => (this.users = list),
      error: (err) => console.error('Greška pri učitavanju korisnika', err),
    });
  }

}
