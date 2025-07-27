import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiry: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(data: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
    tap(res => {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
    })
  );
  }

  register(data: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data, {
      responseType: 'text' as 'json',
    });
  }
   logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Jednostavan getter da proveriš da li si ulogovan
   */
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getUserId(): number | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const obj = JSON.parse(json);
      // ako backend koristi claim "userId":
      if (obj.userId) {
        return Number(obj.userId);
      }
      // ili ako ti je ID u "sub":
      if (obj.sub && !isNaN(+obj.sub)) {
        return Number(obj.sub);
      }
    } catch (e) {
      console.error('Neuspešno parsiranje userId iz tokena', e);
    }
    return null;
  }
}
