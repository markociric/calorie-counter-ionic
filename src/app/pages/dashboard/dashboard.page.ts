import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FoodService } from 'src/app/services/food.service';
import { FoodItem } from 'src/app/models/food-item.model';
import { AlertInput } from '@ionic/angular';
import { EntryService, DailyEntry } from 'src/app/services/entry.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone:false,
})
export class DashboardPage {
  dailyTarget: number | null = null;
  currentCalories = 0;
  foodItems: FoodItem[] = [];
  todayEntry: DailyEntry | null = null;

  constructor(
    private alertCtrl: AlertController,
    private foodService: FoodService,
    private entryService: EntryService,
    private auth: AuthService
  ) {}

  ionViewDidEnter() {
    // 1) Učitaj dnevni cilj i trenutno stanje iz localStorage
    const savedTarget = localStorage.getItem('dailyTarget');
    if (savedTarget) {
      this.dailyTarget = +savedTarget;
    }
    const savedCurrent = localStorage.getItem('currentCalories');
    this.currentCalories = savedCurrent ? +savedCurrent : 0;

    // 2) Ako nema cilja, pitaj ga
    if (this.dailyTarget === null) {
      this.promptDailyTarget();
    }

    // 3) Učitaj namirnice za combobox
    this.foodService.readFoodItems().subscribe(items => {
      this.foodItems = items;
    });

    // 4) Učitaj današnji unos iz baze
    this.loadTodayEntry();
  }

  private async promptDailyTarget() {
    const alert = await this.alertCtrl.create({
      header: 'Dnevni unos kalorija',
      message: 'Unesite željeni dnevni unos kalorija:',
      inputs: [
        { name: 'target', type: 'number', min: 1, placeholder: 'npr. 2000' }
      ],
      backdropDismiss: false,
      buttons: [
        {
          text: 'Potvrdi',
          handler: (data: { target: string }) => {
            const val = parseInt(data.target, 10);
            if (isNaN(val) || val <= 0) {
              this.promptDailyTarget();
            } else {
              this.dailyTarget = val;
              localStorage.setItem('dailyTarget', val.toString());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async changeDailyTarget() {
    await this.promptDailyTarget();
    this.loadTodayEntry();
  }

  /** Učitaj današnji unos sa backend‑a */
  private loadTodayEntry() {
    this.entryService.getTodayEntry().subscribe({
      next: (daily: DailyEntry) => {
        this.todayEntry = daily;
        this.currentCalories = daily.totalCalories;
        localStorage.setItem('currentCalories', this.currentCalories.toString());
      },
      error: err => {
        console.error('Ne mogu da učitam dnevni unos', err);
      }
    });
  }

  /** Pokreće unos nove hrane */
  async addDailyEntry() {
    const radioInputs: AlertInput[] = this.foodItems.map(item => ({
      type: 'radio' as const,
      name: 'food',
      label: item.name,
      value: item.id!.toString()
    }));

    const selectAlert = await this.alertCtrl.create({
      header: 'Izaberite namirnicu',
      inputs: radioInputs,
      backdropDismiss: false,
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Dalje',
          handler: (selectedId: string) => {
            const id = parseInt(selectedId, 10);
            this.promptGrams(id);
          }
        }
      ]
    });
    await selectAlert.present();
  }

  /** Nakon izbora namirnice, pitamo za grame */
  private async promptGrams(foodId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Unesite grame',
      inputs: [
        { name: 'grams', type: 'number', min: 1, placeholder: 'npr. 150' }
      ],
      backdropDismiss: false,
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Potvrdi',
          handler: (data: { grams: string }) => {
            const grams = parseInt(data.grams, 10);
            if (isNaN(grams) || grams <= 0) {
              this.promptGrams(foodId);
            } else {
              this.logEntry(foodId, grams);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  /** Poziva backend da zabeleži unos i zatim učitava novi dnevni unos */
  private logEntry(foodId: number, grams: number) {
    this.entryService.logFoodEntry(foodId, grams).subscribe({
      next: () => {
        this.loadTodayEntry();
      },
      error: err => {
        console.error('Greška pri logovanju unosa hrane', err);
      }
    });
  }
}
