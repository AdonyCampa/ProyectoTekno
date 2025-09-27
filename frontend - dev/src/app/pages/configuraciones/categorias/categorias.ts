import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

import Swal from 'sweetalert2';
import { FormCat } from './form-cat/form-cat';
import { CategoriasService } from '../../../services/categorias.service';
import { Categoria } from '../../../interfaces/categorias';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  imports: [ɵInternalFormsSharedModule, FormsModule, FormCat, CommonModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss',
})
export class Categorias implements OnInit, OnDestroy {
  catService = inject(CategoriasService);
  categorias: Categoria[] = [];
  filteredCategorias: Categoria[] = []; // roles paginados después de filtro y orden

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof Categoria = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  categoriaSeleccionada!: Categoria | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getCategorias();
    this.subscription = this.catService.refresh$.subscribe(() => this.getCategorias());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCategorias() {
    this.catService.getCategorias().subscribe((data) => {
      this.categorias = data;
      console.log(this.categorias);

      this.applyFilters();
    });
  }

  openForm(categoria: Categoria | null, modo: 'crear' | 'editar' | 'ver') {
    this.categoriaSeleccionada = categoria
      ? { ...categoria }
      : { categoria: '', estado: false, descripcion: '' };
    this.modoFormulario = modo;
  }

  deleteCategoria(categoria: Categoria) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar la categoria "${categoria.categoria}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.catService.deleteCategoria(categoria.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Categoria "${categoria.categoria}" fue eliminada exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.categorias];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (c) =>
          c.categoria!.toLowerCase().includes(term) ||
          c.descripcion!.toLowerCase().includes(term) ||
          c.id!.toString().includes(term)
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
    this.filteredCategorias = data.slice(start, end);
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
  sortBy(column: keyof Categoria) {
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
