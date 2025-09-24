import { Component, effect, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { RolService } from '../../services/roles.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Rol } from '../../interfaces/roles';
import { DATATABLES_ES } from '../../constants/datatables-es';
import { FormRol } from './form-rol/form-rol';
import { Subject, Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
  selector: 'app-roles',
  imports: [FormRol, ɵInternalFormsSharedModule, FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.scss',
})
export class Roles implements OnInit, OnDestroy {
  rolService = inject(RolService);
  roles: Rol[] = [];

  page = 1; // página actual
  pageSize = 5; // filas por página
  search = '';

  rolSeleccionado!: Rol | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getRoles();

    this.rolService.refresh$.subscribe(() => this.getRoles());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getRoles() {
    this.rolService.getRoles().subscribe((data) => (this.roles = data));
  }

  openForm(rol: Rol | null, modo: 'crear' | 'editar' | 'ver') {
    this.rolSeleccionado = rol ? { ...rol } : { rol: '', descripcion: '' };
    this.modoFormulario = modo;
  }

  deleteRol(rol: Rol) {
    if (rol.id && confirm(`¿Desea eliminar el rol "${rol.rol}"?`)) {
      this.rolService.deleteRol(rol.id).subscribe();
    }
  }

  get filteredRoles(): Rol[] {
    let filtered = this.roles;

    if (this.search) {
      filtered = filtered.filter(
        (r) =>
          r.rol!.toLowerCase().includes(this.search.toLowerCase()) ||
          r.descripcion!.toLowerCase().includes(this.search.toLowerCase())
      );
    }

    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    const filteredLength = this.roles.filter(
      (r) =>
        r.rol!.toLowerCase().includes(this.search.toLowerCase()) ||
        r.descripcion!.toLowerCase().includes(this.search.toLowerCase())
    ).length;

    return Math.ceil(filteredLength / this.pageSize);
  }

  changePage(delta: number): void {
    const newPage = this.page + delta;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
    }
  }
}
