import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { Categoria, CategoriaResponse } from '../interfaces/categorias';
import { HttpClient } from '@angular/common/http';
import { Apertura, AperturaResponse, MovimientoCaja, MovimientoResponse } from '../interfaces/caja';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class CajaMovimientosService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getMovimientos(): Observable<MovimientoCaja[]> {
    const url = `${baseUrl}/caja-movimientos`;
    return this.http.get<MovimientoCaja[]>(url);
  }

  MovimientoCaja(apertura: number, asunto: boolean, concepto: string, monto: number) {
    const url = `${baseUrl}/caja-movimientos/new`;
    const body = { apertura, asunto, concepto, monto };

    return this.http.post<MovimientoResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  EditarMovimiento(id: number, apertura: number, asunto: boolean, concepto: string, monto: number) {
    const url = `${baseUrl}/caja-movimientos/editar/${id}`;
    const body = { apertura, asunto, concepto, monto };

    return this.http.put<MovimientoResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteMovimiento(id: number) {
    const url = `${baseUrl}/caja-movimientos/eliminar/${id}`;
    return this.http.delete<MovimientoResponse>(url).pipe(
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
