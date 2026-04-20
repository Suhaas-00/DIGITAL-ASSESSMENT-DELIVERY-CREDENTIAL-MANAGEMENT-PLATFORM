import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from '../../models/app.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_TOKEN = 'auth_token';
  private readonly USER_ROLE = 'user_role';
  private readonly USERNAME = 'username';

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private baseUrl = `${environment.apiUrl}/api/users`; // ✅ FIXED BASE PATH

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem(this.AUTH_TOKEN);

    if (token) {
      this.currentUserSubject.next({
        token,
        role: localStorage.getItem(this.USER_ROLE) || '',
        username: localStorage.getItem(this.USERNAME) || ''
      });
    }
  }

  // ✅ REGISTER
  register(user: User): Observable<any> {
    console.log("📤 Register API:", `${this.baseUrl}/register`);
    console.log("📦 Payload:", user);

    return this.http.post(`${this.baseUrl}/register`, user);
  }

  // ✅ LOGIN
  login(credentials: any): Observable<AuthResponse> {
    console.log("📤 Login API:", `${this.baseUrl}/login`);
    console.log("📦 Payload:", credentials);

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(res => {
        console.log("✅ Login Success:", res);

        localStorage.setItem(this.AUTH_TOKEN, res.token);
        localStorage.setItem(this.USER_ROLE, res.role);
        localStorage.setItem(this.USERNAME, res.username);
        if (res.userId) {
          localStorage.setItem('user_id', res.userId.toString());
        }

        this.currentUserSubject.next(res);
      })
    );
  }

  // ✅ LOGOUT
  logout() {
    localStorage.removeItem(this.AUTH_TOKEN);
    localStorage.removeItem(this.USER_ROLE);
    localStorage.removeItem(this.USERNAME);

    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // ✅ HELPERS
  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.USER_ROLE);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): { id: number; username: string; role: string } | null {
    const token = this.getToken();
    const username = this.getUsername();
    const role = this.getUserRole();
    if (!token || !username) return null;
    // Extract user id from localStorage if stored at login
    const id = parseInt(localStorage.getItem('user_id') || '0', 10);
    return { id, username, role: role || '' };
  }
}