import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  message: string;
  user: { id: number; nom: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getUser(): { id: number; nom: string; email: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}