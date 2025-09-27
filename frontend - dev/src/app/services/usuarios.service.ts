import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioResponse } from '../interfaces/usuarios';

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
    return this.http.get<Usuario[]>(url);
  }

  crearUsuario(
    nombres: string,
    apellidos: string,
    usuario: string,
    rol: number,
    correo: string,
    direccion: string,
    estado: boolean,
    password: string,
    repeatpassword: string
  ) {
    const url = `${baseUrl}/usuarios/new`;
    const body = {
      nombres,
      apellidos,
      usuario,
      rol,
      correo,
      direccion,
      estado,
      password,
      repeatpassword,
    };

    return this.http.post<UsuarioResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
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
    usuario: string,
    rol: number,
    correo: string,
    direccion: string,
    estado: boolean
  ) {
    const url = `${baseUrl}/usuarios/editar/${id}`;
    const body = { id, nombres, apellidos, usuario, rol, estado, correo, direccion };

    return this.http.put<UsuarioResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteUsuario(id: number) {
    const url = `${baseUrl}/usuarios/eliminar/${id}`;
    return this.http.delete<UsuarioResponse>(url).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }
}
