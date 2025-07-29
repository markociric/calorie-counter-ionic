import { Component, OnInit } from '@angular/core';
import { EntryService, DailyEntry } from 'src/app/services/entry.service';
import { FoodService } from 'src/app/services/food.service';
import { FoodItem } from 'src/app/models/food-item.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false,
})
export class HistoryPage implements OnInit {
  history: DailyEntry[] = [];
  expandedDates: Set<string> = new Set();
  foodItems: FoodItem[] = []; 

  constructor(
    private entryService: EntryService,
    private foodService: FoodService 
  ) {}

  ngOnInit() {
    this.entryService.getAllEntries().subscribe({
      next: (data: DailyEntry[]) => (this.history = data),
      error: err => console.error('Greška pri učitavanju istorije', err)
    });

    this.foodService.readFoodItems().subscribe({
      next: (items: FoodItem[]) => (this.foodItems = items),
      error: err => console.error('Greška pri učitavanju namirnica', err)
    });
  }

  toggleExpand(date: string) {
    this.expandedDates.has(date)
      ? this.expandedDates.delete(date)
      : this.expandedDates.add(date);
  }

  isExpanded(date: string): boolean {
    return this.expandedDates.has(date);
  }

  getCalories(foodName: string, grams: number): number {
    const item = this.foodItems.find(
      i => i.name.toLowerCase() === foodName.toLowerCase()
    );
    if (!item) return 0;
    return Math.round((item.caloriesPer100g * grams) / 100);
  }
}