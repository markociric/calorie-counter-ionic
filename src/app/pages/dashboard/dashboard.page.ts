import { Component, OnInit } from '@angular/core';

import { addIcons } from 'ionicons';
import { library, playCircle, radio, search } from 'ionicons/icons';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone:false,
})
export class DashboardPage implements OnInit {

  constructor() { 
    addIcons({ library, playCircle, radio, search });
  }

  ngOnInit() {
  }

}
