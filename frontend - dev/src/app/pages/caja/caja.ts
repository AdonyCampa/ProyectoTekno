import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormApertura } from './form-apertura/form-apertura';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CajaAperturasService } from '../../services/caja-aperturas.service';
import { Apertura, MovimientoCaja } from '../../interfaces/caja';
import { Subscription } from 'rxjs';
import { FormCerrar } from './form-cerrar/form-cerrar';
import { CajaMovimientosService } from '../../services/caja-movimientos.service';
import Swal from 'sweetalert2';
import { FormMovimiento } from './form-movimiento/form-movimiento';

@Component({
  selector: 'app-caja',
  imports: [
    FormApertura,
    FormCerrar,
    FormMovimiento,
    ɵInternalFormsSharedModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './caja.html',
  styleUrl: './caja.scss',
})
export class Caja implements OnInit, OnDestroy {
  userInfo = inject(AuthService);
  cajaService = inject(CajaAperturasService);
  caja: Apertura = {};

  movService = inject(CajaMovimientosService);
  movimientos: MovimientoCaja[] = [];
  filteredMovimientos: MovimientoCaja[] = [];

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof MovimientoCaja = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  movimientoSeleccionado!: MovimientoCaja | null;
  modoFormulario: 'apertura' | 'cierre' | 'ver' = 'apertura';
  modoMFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getCaja();
    this.getMovimientos();
    this.subscription = this.movService.refresh$.subscribe(() => this.getMovimientos());
    this.subscription = this.cajaService.refresh$.subscribe(() => this.getCaja());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCaja() {
    this.cajaService.getStatus().subscribe((data) => {
      this.caja = data;
      console.log(this.caja);
    });
  }

  getMovimientos() {
    this.movService.getMovimientos().subscribe((data) => {
      this.movimientos = data;
      console.log(this.movimientos);
    });
  }

  openForm(modo: 'apertura' | 'cierre' | 'ver') {
    this.modoFormulario = modo;
  }

  openFormM(movimiento: MovimientoCaja | null, modo: 'crear' | 'editar' | 'ver') {
    this.movimientoSeleccionado = movimiento
      ? { ...movimiento }
      : { apertura: 0, asunto: true, concepto: '', monto: 0 };
    this.modoMFormulario = modo;
  }

  deleteMovimiento(movimiento: MovimientoCaja) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar el movimiento de caja "${movimiento.id}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.movService.deleteMovimiento(movimiento.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Movimiento de caja "${movimiento.id}" fue eliminado exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.movimientos];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (m) =>
          m.apertura!.toString().includes(term) ||
          m.asunto!.toString().includes(term) ||
          m.concepto!.toLowerCase().includes(term) ||
          m.monto!.toString().includes(term) ||
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
    this.filteredMovimientos = data.slice(start, end);
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
  sortBy(column: keyof MovimientoCaja) {
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
