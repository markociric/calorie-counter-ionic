import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppUser {
  username: string;
  role: string;   // backend vraća listu rola
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080';  // prilagodi ako je drugačije

  constructor(private http: HttpClient) {}

  /** GET /users → lista svih korisnika */
  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/auth/users`);
  }
}
