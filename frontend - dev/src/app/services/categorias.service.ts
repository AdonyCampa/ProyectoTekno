import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { Categoria, CategoriaResponse } from '../interfaces/categorias';
import { HttpClient } from '@angular/common/http';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getCategorias(): Observable<Categoria[]> {
    const url = `${baseUrl}/categorias`;
    return this.http.get<Categoria[]>(url);
  }

  crearCategoria(categoria: string, estado: boolean, descripcion: string) {
    const url = `${baseUrl}/categorias/new`;
    const body = { categoria, estado, descripcion };

    return this.http.post<CategoriaResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  editarCategoria(id: number, categoria: string, estado: boolean, descripcion: string) {
    const url = `${baseUrl}/categorias/editar/${id}`;
    const body = { categoria, estado, descripcion };

    return this.http.put<CategoriaResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteCategoria(id: number) {
    const url = `${baseUrl}/categorias/eliminar/${id}`;
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
