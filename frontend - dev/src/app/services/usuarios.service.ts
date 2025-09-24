import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, Usuario, UsuarioResponse } from '../interfaces/usuarios';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getUsuarios(): Observable<Usuario[]> {
    const url = `${baseUrl}/usuarios`;
    return this.http.get<Usuario[]>(url).pipe(tap((resp) => console.log(resp)));
  }

  crearUsuario(
    nombres: string,
    apellidos: string,
    dpi: string,
    usuario: string,
    rol: number,
    estado: boolean,
    password: string
  ) {
    const url = `${baseUrl}/roles/new`;
    const body = { nombres, apellidos, dpi, usuario, rol, estado, password };

    return this.http.post<UsuarioResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
          console.log(resp.msg);
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  editarUsuario(
    id: number,
    nombres: string,
    apellidos: string,
    dpi: string,
    usuario: string,
    rol: number,
    estado: boolean,
    password: string
  ) {
    const url = `${baseUrl}/roles/editar/${id}`;
    const body = { id, nombres, apellidos, dpi, usuario, rol, estado, password };

    return this.http.put<UsuarioResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
          console.log(resp.msg);
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteUsuario(id: number) {
    const url = `${baseUrl}/roles/eliminar/${id}`;
    return this.http.delete<UsuarioResponse>(url).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
          console.log(resp.msg);
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }
}
