import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/usuarios';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<Usuario | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  chekStatusResouce = rxResource({
    stream: () => this.checkStatus()
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);

  login(usuario: string, password: string): Observable<boolean> {
    const url = `${baseUrl}/auth/login`;
    const body = { usuario, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  checkStatus(): Observable<boolean> {
    const url = `${baseUrl}/auth/renew`;
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);

    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', token);

    console.log(this._user());

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

}
