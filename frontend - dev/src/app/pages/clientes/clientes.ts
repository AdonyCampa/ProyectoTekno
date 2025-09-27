import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../interfaces/clientes';
import { CommonModule } from '@angular/common';
import { FormCliente } from './form-cliente/form-cliente';

@Component({
  selector: 'app-clientes',
  imports: [ɵInternalFormsSharedModule, FormsModule, FormCliente, CommonModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
})
export class Clientes implements OnInit, OnDestroy {
  clienteService = inject(ClientesService);
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = []; // roles paginados después de filtro y orden

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof Cliente = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  clienteSeleccionado!: Cliente | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getClientes();
    this.subscription = this.clienteService.refresh$.subscribe(() => this.getClientes());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getClientes() {
    this.clienteService.getClientes().subscribe((data) => {
      this.clientes = data;
      console.log(this.clientes);

      this.applyFilters();
    });
  }

  openForm(cliente: Cliente | null, modo: 'crear' | 'editar' | 'ver') {
    this.clienteSeleccionado = cliente
      ? { ...cliente }
      : {
          nombres: '',
          apellidos: '',
          dpi: '',
          nit: '',
          telefono: '',
          correo: '',
          direccion: '',
          estado: false,
        };
    this.modoFormulario = modo;
  }

  deleteCliente(cliente: Cliente) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar el cliente "${cliente.nombres}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(cliente.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Cliente "${cliente.nombres}" fue eliminada exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.clientes];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (c) =>
          c.nombres!.toLowerCase().includes(term) ||
          c.apellidos!.toLowerCase().includes(term) ||
          c.dpi!.toLowerCase().includes(term) ||
          c.nit!.toLowerCase().includes(term) ||
          c.telefono!.toLowerCase().includes(term) ||
          c.correo!.toLowerCase().includes(term) ||
          c.direccion!.toLowerCase().includes(term) ||
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
    this.filteredClientes = data.slice(start, end);
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
  sortBy(column: keyof Cliente) {
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
