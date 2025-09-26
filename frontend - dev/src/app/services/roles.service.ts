import { inject, Injectable } from '@angular/core';
import { Rol, RolResponse } from '../interfaces/roles';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getRoles(): Observable<Rol[]> {
    const url = `${baseUrl}/roles`;
    return this.http.get<Rol[]>(url);
  }

  crearRol(rol: string, descripcion: string) {
    const url = `${baseUrl}/roles/new`;
    const body = { rol, descripcion };

    return this.http.post<RolResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  editarRol(id: number, rol: string, descripcion: string) {
    const url = `${baseUrl}/roles/editar/${id}`;
    const body = { rol, descripcion };

    return this.http.put<RolResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteRol(id: number) {
    const url = `${baseUrl}/roles/eliminar/${id}`;
    return this.http.delete<RolResponse>(url).pipe(
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
