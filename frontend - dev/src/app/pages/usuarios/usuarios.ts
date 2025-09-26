import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuarios';
import { FormUser } from './form-user/form-user';
import { Subscription } from 'rxjs';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { RolService } from '../../services/roles.service';
import { Rol } from '../../interfaces/roles';

@Component({
  selector: 'app-usuarios',
  imports: [FormUser, ɵInternalFormsSharedModule, FormsModule, CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit, OnDestroy {
  userService = inject(UserService);
  rolService = inject(RolService);
  roles: Rol[] = [];
  usuarios: Usuario[] = [];
  filteredUsers: Usuario[] = []; // roles paginados después de filtro y orden

  page = 1; // página actual
  pageSize = 5; // filas por página
  totalRecords = 0;

  // 🔹 El tipo de columna es keyof Rol
  sortColumn: keyof Usuario = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  usuarioSeleccionado!: Usuario | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getUsuarios();
    this.getRoles();
    this.subscription = this.userService.refresh$.subscribe(() => this.getUsuarios());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUsuarios() {
    this.userService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      this.applyFilters();
    });
  }

  getRoles() {
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  openForm(usuario: Usuario | null, modo: 'crear' | 'editar' | 'ver') {
    this.usuarioSeleccionado = usuario
      ? { ...usuario }
      : {
          nombres: '',
          usuario: '',
          apellidos: '',
          password: '',
          rol: 0,
          estado: true,
          correo: '',
          direccion: '',
        };
    this.modoFormulario = modo;
  }

  deleteUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Desea eliminar el usuario "${usuario.usuario}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUsuario(usuario.id!).subscribe();
        Swal.fire({
          title: 'Eliminado!',
          text: `Rol "${usuario.usuario}" fue eliminado exitosamente`,
          icon: 'success',
        });
      }
    });
  }

  /** Aplica búsqueda, orden y paginación */
  applyFilters() {
    let data = [...this.usuarios];

    // 🔎 Filtro de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (u) =>
          u.nombres!.toLowerCase().includes(term) ||
          u.apellidos!.toLowerCase().includes(term) ||
          u.usuario!.toLowerCase().includes(term) ||
          u.rol!.toString().includes(term) ||
          u.correo!.toLowerCase().includes(term) ||
          u.direccion!.toLowerCase().includes(term) ||
          u.id!.toString().includes(term)
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
    this.filteredUsers = data.slice(start, end);
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
  sortBy(column: keyof Usuario) {
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

  rolName(id: number) {
    const rol = this.roles.find((r) => r.id === id);
    return rol ? rol.rol : 'Rol no encontrado';
  }
}
