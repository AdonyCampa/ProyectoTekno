import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { Producto, ProductoResponse } from '../interfaces/productos';
import { HttpClient } from '@angular/common/http';

const baseUrl = environment.baseUrl;
const _refresh$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private http = inject(HttpClient);

  refresh$ = _refresh$.asObservable();

  getProductos(): Observable<Producto[]> {
    const url = `${baseUrl}/productos`;
    return this.http.get<Producto[]>(url);
  }

  crearProducto(
    producto: string,
    stockmin: number,
    stockmax: number,
    medida: number,
    categoria: number,
    marca: number,
    precio_venta: number,
    precio_costo: number,
    descripcion: string,
    estado: boolean
  ) {
    const url = `${baseUrl}/productos/new`;
    const body = {
      producto,
      stockmin,
      stockmax,
      medida,
      categoria,
      marca,
      precio_venta,
      precio_costo,
      descripcion,
      estado,
    };

    return this.http.post<ProductoResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  editarProducto(
    id: number,
    producto: string,
    stockmin: number,
    stockmax: number,
    medida: number,
    categoria: number,
    marca: number,
    precio_venta: number,
    precio_costo: number,
    descripcion: string,
    estado: boolean
  ) {
    const url = `${baseUrl}/productos/editar/${id}`;
    const body = {
      producto,
      stockmin,
      stockmax,
      medida,
      categoria,
      marca,
      precio_venta,
      precio_costo,
      descripcion,
      estado,
    };

    return this.http.put<ProductoResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          _refresh$.next();
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  deleteProducto(id: number) {
    const url = `${baseUrl}/productos/eliminar/${id}`;
    return this.http.delete<ProductoResponse>(url).pipe(
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
