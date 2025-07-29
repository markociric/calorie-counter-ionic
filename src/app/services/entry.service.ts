import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodItem } from '../models/food-item.model';

export interface DailyEntry {
  id: number;
  date: string;
  totalCalories: number;
  entries: FoodEntry[];
}

export interface FoodEntry {
  grams: number;
  foodName: string;
}

@Injectable({ providedIn: 'root' })
export class EntryService {
  private url = 'http://localhost:8080/food';

  constructor(private http: HttpClient) {}

  /** Šalje unos hrane backendu */
  logFoodEntry(foodName: string, grams: number): Observable<DailyEntry> {
    return this.http.post<DailyEntry>(`${this.url}/food-entries`, {
      foodName,
      grams
    });
  }

  /** Učitava dnevni unos za danas */
  getTodayEntry(): Observable<DailyEntry> {
    const today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd
    return this.http.get<DailyEntry>(`${this.url}/daily-entries?date=${today}`);
  }
}
