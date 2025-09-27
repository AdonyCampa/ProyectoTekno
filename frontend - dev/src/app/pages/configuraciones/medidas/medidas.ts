import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { FormMedida } from './form-medida/form-medida';
import { MedidasService } from '../../../services/medidas.service';
import { Medida } from '../../../interfaces/medidas';

@Component({
  selector: 'app-medidas',
  imports: [ɵInternalFormsSharedModule, FormsModule, CommonModule, FormMedida],
  templateUrl: './medidas.html',
  styleUrl: './medidas.scss',
})
export class Medidas implements OnInit, OnDestroy {
  medidaService = inject(MedidasService);
  medidas: Medida[] = [];
  filteredMedidas: Medida[] = []; // roles paginados después de filtro y orden

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof Medida = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  medidaSeleccionada!: Medida | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getMedidas();
    this.subscription = this.medidaService.refresh$.subscribe(() => this.getMedidas());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMedidas() {
    this.medidaService.getMedidas().subscribe((data) => {
      this.medidas = data;
      this.applyFilters();
    });
  }

  openForm(medida: Medida | null, modo: 'crear' | 'editar' | 'ver') {
    this.medidaSeleccionada = medida
      ? { ...medida }
      : { medida: '', abreviatura: '', estado: false, descripcion: '' };
    this.modoFormulario = modo;
  }

  deleteMedida(medida: Medida) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar la medida "${medida.medida}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medidaService.deleteMedida(medida.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Medida "${medida.medida}" fue eliminada exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.medidas];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (m) =>
          m.medida!.toLowerCase().includes(term) ||
          m.abreviatura!.toLowerCase().includes(term) ||
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
    this.filteredMedidas = data.slice(start, end);
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
  sortBy(column: keyof Medida) {
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
