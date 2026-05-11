import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from './api-base';


export interface SetupStatusResponse {
  setupRequired: boolean;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminSetupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly apiUrl = `${API_BASE_URL}/api/admin/auth`;
  private readonly tokenKey = 'freightflow360_admin_token';
  private readonly adminKey = 'freightflow360_admin_user';

  constructor(private http: HttpClient) {}

  setupStatus(): Observable<SetupStatusResponse> {
    return this.http.get<SetupStatusResponse>(`${this.apiUrl}/setup-status`);
  }

  setup(data: AdminSetupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/setup`, data).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  login(data: AdminLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(
      this.adminKey,
      JSON.stringify({
        email: response.email,
        fullName: response.fullName,
        role: response.role
      })
    );
  }
}