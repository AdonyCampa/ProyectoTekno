import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Medida, MedidaResponse } from '../interfaces/medidas';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class MedidasService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getMedidas(): Observable<Medida[]> {
    const url = `${baseUrl}/medidas`;
    return this.http.get<Medida[]>(url);
  }

  crearMedida(medida: string, abreviatura: string, estado: boolean, descripcion: string) {
    const url = `${baseUrl}/medidas/new`;
    const body = { medida, abreviatura, estado, descripcion };

    return this.http.post<MedidaResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  editarMedida(
    id: number,
    medida: string,
    abreviatura: string,
    estado: boolean,
    descripcion: string
  ) {
    const url = `${baseUrl}/medidas/editar/${id}`;
    const body = { medida, abreviatura, estado, descripcion };

    return this.http.put<MedidaResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteMedida(id: number) {
    const url = `${baseUrl}/medidas/eliminar/${id}`;
    return this.http.delete<MedidaResponse>(url).pipe(
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
