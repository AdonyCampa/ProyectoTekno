import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { Proveedor, ProveedorResponse } from '../interfaces/proveedores';
import { HttpClient } from '@angular/common/http';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getProveedores(): Observable<Proveedor[]> {
    const url = `${baseUrl}/proveedores`;
    return this.http.get<Proveedor[]>(url);
  }

  crearProveedor(
    empresa: string,
    contacto: string,
    telefono: string,
    correo: string,
    direccion: string,
    estado: boolean
  ) {
    const url = `${baseUrl}/proveedores/new`;
    const body = { empresa, contacto, telefono, correo, direccion, estado };

    return this.http.post<ProveedorResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  editarProveedor(
    id: number,
    empresa: string,
    contacto: string,
    telefono: string,
    correo: string,
    direccion: string,
    estado: boolean
  ) {
    const url = `${baseUrl}/proveedores/editar/${id}`;
    const body = { empresa, contacto, telefono, correo, direccion, estado };

    return this.http.put<ProveedorResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteProveedor(id: number) {
    const url = `${baseUrl}/proveedores/eliminar/${id}`;
    return this.http.delete<ProveedorResponse>(url).pipe(
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
