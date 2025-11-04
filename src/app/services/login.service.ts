import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrl: string = "/api/JWT/";
  constructor(private http: HttpClient) {}

  loginUser(obj: any) {
    return this.http.post(this.apiUrl + "login", obj);
  }
}
