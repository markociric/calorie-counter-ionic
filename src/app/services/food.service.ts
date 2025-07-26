import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodItem } from '../models/food-item.model';

@Injectable({ providedIn: 'root' })
export class FoodService {
    // prilagodi URL onome što tvoj Spring backend koristi
    private baseUrl = 'http://localhost:8080/food/food-items';

    constructor(private http: HttpClient) { }

    // Metoda za kreiranje novog itema
    createFoodItem(item: FoodItem): Observable<FoodItem> {
        return this.http.post<FoodItem>(this.baseUrl, item);
    }
    /** Učitaj sve namirnice */
    readFoodItems(): Observable<FoodItem[]> {
        return this.http.get<FoodItem[]>(this.baseUrl);
    }
    updateFoodItem(item: FoodItem): Observable<FoodItem> {
        // Spring očekuje PUT /food/food-items/{id} s telom cele entitete
        return this.http.put<FoodItem>(
            `${this.baseUrl}/${item.id}`,
            item
        );
    }

    /** Briše dati item */
    deleteFoodItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
