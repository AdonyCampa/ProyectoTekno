import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { ProveedoresService } from '../../services/proveedores.service';
import { Proveedor } from '../../interfaces/proveedores';
import { CommonModule } from '@angular/common';
import { FormProveedor } from './form-proveedor/form-proveedor';

@Component({
  selector: 'app-proveedores',
  imports: [ɵInternalFormsSharedModule, FormsModule, FormProveedor, CommonModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.scss',
})
export class Proveedores implements OnInit, OnDestroy {
  proveedorService = inject(ProveedoresService);
  proveedores: Proveedor[] = [];
  filteredProveedores: Proveedor[] = []; // roles paginados después de filtro y orden

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof Proveedor = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  proveedorSeleccionado!: Proveedor | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getProveedores();
    this.subscription = this.proveedorService.refresh$.subscribe(() => this.getProveedores());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProveedores() {
    this.proveedorService.getProveedores().subscribe((data) => {
      this.proveedores = data;
      console.log(this.proveedores);

      this.applyFilters();
    });
  }

  openForm(proveedor: Proveedor | null, modo: 'crear' | 'editar' | 'ver') {
    this.proveedorSeleccionado = proveedor
      ? { ...proveedor }
      : { empresa: '', contacto: '', telefono: '', correo: '', direccion: '', estado: false };
    this.modoFormulario = modo;
  }

  deleteProveedor(proveedor: Proveedor) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar el proveedor "${proveedor.empresa}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.deleteProveedor(proveedor.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Proveedor "${proveedor.empresa}" fue eliminada exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.proveedores];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (p) =>
          p.empresa!.toLowerCase().includes(term) ||
          p.contacto!.toLowerCase().includes(term) ||
          p.telefono!.toLowerCase().includes(term) ||
          p.correo!.toLowerCase().includes(term) ||
          p.direccion!.toLowerCase().includes(term) ||
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
    this.filteredProveedores = data.slice(start, end);
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
  sortBy(column: keyof Proveedor) {
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
