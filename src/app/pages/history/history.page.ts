import { Component, OnInit } from '@angular/core';
import { EntryService, DailyEntry } from 'src/app/services/entry.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false,
})
export class HistoryPage implements OnInit {
  history: DailyEntry[] = [];
  expandedDates: Set<string> = new Set();

  constructor(private entryService: EntryService) {}

  ngOnInit() {
    this.entryService.getAllEntries().subscribe({
      next: (data: DailyEntry[]) => {
        this.history = data;
      },
      error: err => console.error('Greška pri učitavanju istorije', err)
    });
  }

  toggleExpand(date: string) {
    if (this.expandedDates.has(date)) {
      this.expandedDates.delete(date);
    } else {
      this.expandedDates.add(date);
    }
  }

  isExpanded(date: string): boolean {
    return this.expandedDates.has(date);
  }

  getCalories(foodName: string, grams: number): number {
    return Math.round(grams); // ili kasnije koristi foodItems ako želiš tačan proračun
  }
}
