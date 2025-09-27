import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { Marca, MarcaResponse } from '../interfaces/marcas';
import { HttpClient } from '@angular/common/http';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class MarcasService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getMarcas(): Observable<Marca[]> {
    const url = `${baseUrl}/marcas`;
    return this.http.get<Marca[]>(url);
  }

  crearMarca(marca: string, estado: boolean, descripcion: string) {
    const url = `${baseUrl}/marcas/new`;
    const body = { marca, estado, descripcion };

    return this.http.post<MarcaResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  editarMarca(id: number, marca: string, estado: boolean, descripcion: string) {
    const url = `${baseUrl}/marcas/editar/${id}`;
    const body = { marca, estado, descripcion };

    return this.http.put<MarcaResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteMarca(id: number) {
    const url = `${baseUrl}/marcas/eliminar/${id}`;
    return this.http.delete<MarcaResponse>(url).pipe(
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
