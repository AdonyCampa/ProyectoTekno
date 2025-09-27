import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/productos';
import { CommonModule } from '@angular/common';
import { FormProducto } from './form-producto/form-producto';

@Component({
  selector: 'app-productos',
  imports: [ɵInternalFormsSharedModule, FormsModule, FormProducto, CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements OnInit, OnDestroy {
  productoService = inject(ProductosService);
  productos: Producto[] = [];
  filteredProductos: Producto[] = []; // roles paginados después de filtro y orden

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof Producto = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  productoSeleccionado!: Producto | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getProductos();
    this.subscription = this.productoService.refresh$.subscribe(() => this.getProductos());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProductos() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
      console.log(this.productos);

      this.applyFilters();
    });
  }

  openForm(producto: Producto | null, modo: 'crear' | 'editar' | 'ver') {
    this.productoSeleccionado = producto
      ? { ...producto }
      : {
          producto: '',
          stockmin: 0,
          stockmax: 0,
          categoria: 0,
          marca: 0,
          medida: 0,
          precio_venta: 0,
          precio_costo: 0,
          estado: false,
          descripcion: '',
        };
    this.modoFormulario = modo;
  }

  deleteProducto(producto: Producto) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar el producto "${producto.producto}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(producto.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Producto "${producto.producto}" fue eliminada exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.productos];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (p) =>
          p.producto!.toLowerCase().includes(term) ||
          p.stockmin!.toString().includes(term) ||
          p.stockmax!.toString().includes(term) ||
          p.categoria_name!.toLowerCase().includes(term) ||
          p.marca_name!.toLowerCase().includes(term) ||
          p.medida_name!.toLowerCase().includes(term) ||
          p.precio_venta!.toString().includes(term) ||
          p.precio_costo!.toString().includes(term) ||
          p.descripcion!.toLowerCase().includes(term) ||
          p.id!.toString().includes(term)
      );
    }

    // ↕ Ordenamiento
    if (this.sortColumn) {
      data.sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];
        if (valueA! < valueB!) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA! > valueB!) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 📄 Paginación
    this.totalRecords = data.length;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredProductos = data.slice(start, end);
  }

  /** Cambio de página */
  changePage(step: number) {
    this.page += step;
    this.applyFilters();
  }

  /** Total de páginas */
  totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  /** Ordenar por columna */
  sortBy(column: keyof Producto) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  /** Al escribir en el buscador */
  onSearchChange() {
    this.page = 1; // resetear a la primera página
    this.applyFilters();
  }

  status(estado: boolean) {
    if (estado === true) {
      return 'text-bg-success';
    } else {
      return 'text-bg-danger';
    }
  }
}
