import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodItem } from '../models/food-item.model';
export interface DailyEntry {
  id: number;
  date: string;
  totalCalories: number;
  // по потреби додај остала поља
}
export interface FoodEntry {
  id: number;
  grams: number;
  foodItem: FoodItem;
}

export interface DailyEntry {
  id: number;
  date: string;
  totalCalories: number;
  foodEntries: FoodEntry[];   // <-- dodaj ovo polje
}
@Injectable({ providedIn: 'root' })
export class EntryService {
  private url = 'http://localhost:8080/api/entries';

  constructor(private http: HttpClient) {}

  /**
   * Логује нови унос хране:
   * - foodItemId: ID постојеће намирнице
   * - grams: колико грама смо унели
   * - userId: узима се из токена (или prosledi као параметар)
   */
  logFoodEntry(foodItemId: number, grams: number): Observable<DailyEntry> {
  return this.http.post<DailyEntry>(
    this.url,
    { foodItemId, grams }  // prosledi u telu
  );
}
getTodayEntry(): Observable<DailyEntry> {
    return this.http.get<DailyEntry>(`${this.url}/today`);
  }
}