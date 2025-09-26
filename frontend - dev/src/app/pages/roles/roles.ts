import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RolService } from '../../services/roles.service';
import { Rol } from '../../interfaces/roles';
import { FormRol } from './form-rol/form-rol';
import { Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  imports: [FormRol, ɵInternalFormsSharedModule, FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.scss',
})
export class Roles implements OnInit, OnDestroy {
  rolService = inject(RolService);
  roles: Rol[] = [];
  filteredRoles: Rol[] = []; // roles paginados después de filtro y orden

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof Rol = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  rolSeleccionado!: Rol | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getRoles();
    this.subscription = this.rolService.refresh$.subscribe(() => this.getRoles());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getRoles() {
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
      console.log(this.roles);

      this.applyFilters();
    });
  }

  openForm(rol: Rol | null, modo: 'crear' | 'editar' | 'ver') {
    this.rolSeleccionado = rol ? { ...rol } : { rol: '', descripcion: '' };
    this.modoFormulario = modo;
  }

  deleteRol(rol: Rol) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar el rol "${rol.rol}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolService.deleteRol(rol.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Rol "${rol.rol}" fue eliminado exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.roles];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.rol!.toLowerCase().includes(term) ||
          r.descripcion!.toLowerCase().includes(term) ||
          r.id!.toString().includes(term)
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
    this.filteredRoles = data.slice(start, end);
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
  sortBy(column: keyof Rol) {
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
}
