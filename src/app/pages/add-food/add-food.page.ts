import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodService } from 'src/app/services/food.service';
import { FoodItem } from 'src/app/models/food-item.model';
import { ToastController, NavController } from '@ionic/angular';
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

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private toastCtrl: ToastController,
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
    this.foodService.createFoodItem(newItem).subscribe({
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
    });
  }
// Učitaj sve iteme
  loadItems() {
    this.foodService.readFoodItems().subscribe({
      next: (items: FoodItem[]) => {
        this.foodItems = items;
        items.forEach((i: FoodItem) => (this.newCalories[i.id!] = i.caloriesPer100g));
      },
      error: err => console.error(err),
    });
  }

  // Ažuriraj kalorije
  async updateCalories(id: number) {
    const cal = this.newCalories[id];
    this.foodService.updateFoodItem(id, cal).subscribe({
      next: async (updated: FoodItem) => {
        const t = await this.toastCtrl.create({
          message: `Ažurirano: ${updated.name}`,
          duration: 1500,
        });
        await t.present();
        this.loadItems();
      },
      error: async () => {
        const t = await this.toastCtrl.create({
          message: 'Greška pri ažuriranju.',
          duration: 1500,
        });
        await t.present();
      },
    });
  }

  // Obriši item
   async deleteItem(id: number) {
    this.foodService.deleteFoodItem(id).subscribe({
      next: async () => {
        const t = await this.toastCtrl.create({ message: 'Obrisano.', duration: 1500 });
        await t.present();
        this.loadItems();
      },
      error: async () => {
        const t = await this.toastCtrl.create({
          message: 'Greška pri brisanju.',
          duration: 1500,
        });
        await t.present();
      },
    });
  }
}
