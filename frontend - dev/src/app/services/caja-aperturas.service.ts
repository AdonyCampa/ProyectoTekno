import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { Categoria, CategoriaResponse } from '../interfaces/categorias';
import { HttpClient } from '@angular/common/http';
import { Apertura, AperturaResponse } from '../interfaces/caja';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class CajaAperturasService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getAperturas(): Observable<Apertura[]> {
    const url = `${baseUrl}/caja-aperturas`;
    return this.http.get<Apertura[]>(url);
  }
  getAperturasDay(id: number): Observable<Apertura[]> {
    const url = `${baseUrl}/caja-aperturas/${id}`;
    return this.http.get<Apertura[]>(url);
  }
  getStatus(): Observable<Apertura> {
    const url = `${baseUrl}/caja-aperturas/status`;
    return this.http.get<Apertura>(url);
  }

  AperturarCaja(usuario: number, monto_inicial: number) {
    const url = `${baseUrl}/caja-aperturas/apertura`;
    const body = { usuario, monto_inicial };

    return this.http.post<AperturaResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  CerrarCaja(id: number, monto_final: number) {
    const url = `${baseUrl}/caja-aperturas/cierre/${id}`;
    const body = { monto_final };

    return this.http.put<AperturaResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteApertura(id: number) {
    const url = `${baseUrl}/caja-aperturas/eliminar/${id}`;
    return this.http.delete<CategoriaResponse>(url).pipe(
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
