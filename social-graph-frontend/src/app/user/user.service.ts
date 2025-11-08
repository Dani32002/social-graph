import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from './user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {}

  removeFriend(userId: string) {
    const ownId = localStorage.getItem('own_id')!;
    const headers = this.createHeaders();
    return this.http.delete(`${environment.baseUrl}/${ownId}/friends/${userId}`, { headers });
  }

  addFriend(userId: string) {
    const ownId = localStorage.getItem('own_id')!;
    const headers = this.createHeaders();
    return this.http.post(`${environment.baseUrl}/${ownId}/friends/${userId}`, {}, { headers });
  }

  getUsers(): Observable<User[]> {
    const headers = this.createHeaders();
    return this.http.get<User[]>(environment.baseUrl, { headers });
  }

  getFriends(userId: string): Observable<User[]> {
    const headers = this.createHeaders();
    return this.http.get<User[]>(`${environment.baseUrl}/${userId}/friends`, { headers });
  }

  getUserById(userId: string): Observable<User> {
    const headers = this.createHeaders();
    return this.http.get<User>(`${environment.baseUrl}/${userId}`, { headers });
  }

  login(email: string, password: string): Observable<{ token: string, userId: string }> {
    return this.http.post<{ token: string, userId: string }>(`${environment.baseUrl}/login`, { username: email, password });
  }

  register(payload: { name: string; email: string; password: string; bio?: string; avatarUrl?: string }): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/register`, payload);
  }

  validateToken(): Observable<{ valid: boolean }> {
    const headers = this.createHeaders();
    return this.http.get<{ valid: boolean }>(`${environment.baseUrl}/validate-token`, { headers });
  }

  createHeaders(): HttpHeaders | undefined {
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }
  
}
