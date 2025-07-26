import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

login(data: { username: string; password: string }) {
  return this.http.post<{ accessToken: string; refreshToken: string }>(
    `${this.apiUrl}/login`,
    data
  );
}

  register(data: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data, {
  responseType: 'text' as 'json',
});
  }
}
