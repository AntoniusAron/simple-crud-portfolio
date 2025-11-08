import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  apiUrl: string = "/api/JWT/";
  constructor(private http: HttpClient) {}

  setToken(token: any): void {
    localStorage.setItem("angular19User", token.userId);
    localStorage.setItem("angular19Token", token.token);
    localStorage.setItem("angular19TokenData", JSON.stringify(token));
  }

  getToken(): string | null {
    return localStorage.getItem("angular19Token");
  }

  getTokenDataSafe(): any | null {
    const data = localStorage.getItem("angular19TokenData");
    return data ? JSON.parse(data) : null;
  }

  clearToken(): void {
    localStorage.removeItem("angular19User");
    localStorage.removeItem("angular19Token");
    localStorage.removeItem("angular19TokenData");
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("angular19User");
  }

  refreshToken(obj: any) {
    return this.http.post(this.apiUrl + "refresh", obj);
  }
}
