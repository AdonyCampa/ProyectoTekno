import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { Cliente, ClienteResponse } from '../interfaces/clientes';
import { HttpClient } from '@angular/common/http';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getClientes(): Observable<Cliente[]> {
    const url = `${baseUrl}/clientes`;
    return this.http.get<Cliente[]>(url);
  }

  crearCliente(
    nombres: string,
    apellidos: string,
    dpi: string,
    nit: string,
    telefono: string,
    correo: string,
    direccion: string,
    estado: boolean
  ) {
    const url = `${baseUrl}/clientes/new`;
    const body = { nombres, apellidos, dpi, nit, telefono, correo, direccion, estado };

    return this.http.post<ClienteResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  editarCliente(
    id: number,
    nombres: string,
    apellidos: string,
    dpi: string,
    nit: string,
    telefono: string,
    correo: string,
    direccion: string,
    estado: boolean
  ) {
    const url = `${baseUrl}/clientes/editar/${id}`;
    const body = { nombres, apellidos, dpi, nit, telefono, correo, direccion, estado };

    return this.http.put<ClienteResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteCliente(id: number) {
    const url = `${baseUrl}/clientes/eliminar/${id}`;
    return this.http.delete<ClienteResponse>(url).pipe(
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
