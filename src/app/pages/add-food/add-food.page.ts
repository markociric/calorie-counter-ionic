import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodService } from 'src/app/services/food.service';
import { FoodItem } from 'src/app/models/food-item.model';
import { ToastController, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.page.html',
  styleUrls: ['./add-food.page.scss'],
  standalone: false,
})
export class AddFoodPage implements OnInit {

  foodForm!: FormGroup;
  foodItems: FoodItem[] = [];
  newCalories: { [id: number]: number } = {};
  isLoadingList = false;  // spinner za listu
  isSaving = false;       // spinner za dugme "Sačuvaj"
  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      caloriesPer100g: [null, [Validators.required, Validators.min(0)]],
    });
    this.loadItems();
  }

  async onSubmit() {
    if (this.foodForm.invalid) {
      return;
    }

    const newItem: FoodItem = this.foodForm.value;
     this.isSaving = true; // <<< upali spinner u dugmetu
    this.foodService.createFoodItem(newItem).pipe(delay(1200)).subscribe({
      next: async (created: FoodItem) => {
        const toast = await this.toastCtrl.create({
          message: `Namirnica "${created.name}" je dodata!`,
          duration: 2000,
        });
        await toast.present();
        this.foodForm.reset();
        this.loadItems();
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Greška pri dodavanju namirnice.',
          duration: 2000,
        });
        await toast.present();
      },
       complete: () => { this.isSaving = false; } // <<< ugasi spinner
    });
  }
  // Učitaj sve iteme
  loadItems() {
    this.isLoadingList = true;
  this.foodService.readFoodItems()
    .pipe(delay(1500)) // <<< usporenje da vidiš spinner ~1.5s
    .subscribe({
      next: (items: FoodItem[]) => {
        this.foodItems = items;
        items.forEach((i: FoodItem) => (this.newCalories[i.id!] = i.caloriesPer100g));
      },
      error: err => console.error(err),
      complete: () => { this.isLoadingList = false; }
    });
  }

  // Ažuriraj kalorije
  async updateCalories(id: number) {
    // 1) Nađi originalni item iz liste
    const original = this.foodItems.find(i => i.id === id);
    if (!original) { return; }

    // 2) Kloniraj i promeni kalorije
    const updated: FoodItem = {
      ...original,
      caloriesPer100g: this.newCalories[id]
    };

    // 3) Pošalji ceo objekat na backend
    this.foodService.updateFoodItem(updated).subscribe({
      next: async (res: FoodItem) => {
        const t = await this.toastCtrl.create({
          message: `Ažurirano: ${res.name} (${res.caloriesPer100g} kcal)`,
          duration: 1500
        });
        await t.present();
        this.loadItems();
      },
      error: async (err: any) => {
        console.error(err);
        const t = await this.toastCtrl.create({
          message: 'Greška pri ažuriranju.',
          duration: 1500
        });
        await t.present();
      }
    });
  }

  // Obriši item
  async deleteItem(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Potvrda',
      message: 'Da li ste sigurni da želite da obrišete ovu namirnicu?',
      buttons: [
        {
          text: 'Otkaži',
          role: 'cancel'
        },
        {
          text: 'Obriši',
          role: 'destructive',
          handler: () => {
            this.foodService.deleteFoodItem(id).subscribe({
              next: () => {
                //osveži prikaz
                this.toastCtrl
                  .create({
                    message: 'Namirnica je uspešno obrisana',
                    duration: 1500,
                    position: 'bottom'
                  })
                  .then(toast => toast.present());
                this.loadItems();
              },
              error: (err) => {
                console.error('Greška pri brisanju:', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
