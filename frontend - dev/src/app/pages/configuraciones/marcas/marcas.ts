import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { FormMarca } from './form-marca/form-marca';
import { MarcasService } from '../../../services/marcas.service';
import { Marca } from '../../../interfaces/marcas';

@Component({
  selector: 'app-marcas',
  imports: [ɵInternalFormsSharedModule, FormsModule, CommonModule, FormMarca],
  templateUrl: './marcas.html',
  styleUrl: './marcas.scss',
})
export class Marcas implements OnInit, OnDestroy {
  marcaService = inject(MarcasService);
  marcas: Marca[] = [];
  filteredMarcas: Marca[] = []; // roles paginados después de filtro y orden

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof Marca = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  marcaSeleccionada!: Marca | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getMarcas();
    this.subscription = this.marcaService.refresh$.subscribe(() => this.getMarcas());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMarcas() {
    this.marcaService.getMarcas().subscribe((data) => {
      this.marcas = data;
      this.applyFilters();
    });
  }

  openForm(marca: Marca | null, modo: 'crear' | 'editar' | 'ver') {
    this.marcaSeleccionada = marca ? { ...marca } : { marca: '', estado: false, descripcion: '' };
    this.modoFormulario = modo;
  }

  deleteMarca(marca: Marca) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar la marca "${marca.marca}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.marcaService.deleteMarca(marca.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Marca "${marca.marca}" fue eliminada exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.marcas];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (m) =>
          m.marca!.toLowerCase().includes(term) ||
          m.descripcion!.toLowerCase().includes(term) ||
          m.id!.toString().includes(term)
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
    this.filteredMarcas = data.slice(start, end);
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
  sortBy(column: keyof Marca) {
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
