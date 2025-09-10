import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/usuarios';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private basUrl: string = environment.baseUrl
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }

  constructor(private http: HttpClient,
    private storage: StorageService) { }

  login(usuario: string, password: string) {

    const url = `${this.basUrl}/auth/login`;
    const body = { usuario, password };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => {
          if (resp.ok) {
            localStorage.setItem('token', resp.token!);
            this._usuario = {
              id: resp.id,
              usuario: resp.usuario,
              nombres: resp.nombres,
              rol: resp.rol,
              estado: resp.estado
            }

          }
        }),
        map(resp => resp.ok),
        catchError(err => of(err.error.msg))
      );

  }


  validarToken(): Observable<boolean> {
    const url = `${this.basUrl}/auth/renew`;

    const token = this.storage.getItem('token') || ''
    const headers = new HttpHeaders().set('x-token', token);

    return this.http.get<AuthResponse>(url, { headers })
      .pipe(
        map(resp => {
          this._usuario = {
            usuario: resp.usuario,
            id: resp.id,
            nombres: resp.nombres,
            rol: resp.rol,
            estado: resp.estado
          }
          console.log('paso');

          return resp.ok!;
        }),
        catchError(err => of(false))
      )
  }


  logout() {
    localStorage.clear();
  }

}
