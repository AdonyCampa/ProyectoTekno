import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Observable, Subject, Subscription } from 'rxjs';
import { DATATABLES_ES } from '../../constants/datatables-es';
import { Form } from './form/form';
import { UserService } from '../../services/usuarios.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Usuario } from '../../interfaces/usuarios';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  imports: [Form, ɵInternalFormsSharedModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit, OnDestroy {
  userService = inject(UserService);

  usuarios: Usuario[] = [];

  page = 1; // página actual
  pageSize = 5; // filas por página
  search = '';

  usuarioSeleccionado!: Usuario | null;
  modoFormulario: 'crear' | 'editar' | 'ver' = 'crear';

  private subscription!: Subscription;

  ngOnInit(): void {
    this.getUsuarios();

    this.userService.refresh$.subscribe(() => this.getUsuarios());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUsuarios() {
    this.userService.getUsuarios().subscribe((data) => (this.usuarios = data));
  }

  /*       openForm(usuario: Usuario | null, modo: 'crear' | 'editar' | 'ver') {
        this.usuarioSeleccionado = usuario ? { ...usuario } :
        {
          id: [0],
          usuario: '',
          nombres: '',
          apellidos: '',
          password: '',
          dpi: '',
          rol: [0],
          estado:  [true] };
        this.modoFormulario = modo;
      } */

  deleteUsuario(usuario: Usuario) {
    if (usuario.id && confirm(`¿Desea eliminar el usuario "${usuario.usuario}"?`)) {
      this.userService.deleteUsuario(usuario.id).subscribe();
    }
  }

  get filteredUsuarios(): Usuario[] {
    let filtered = this.usuarios;

    if (this.search) {
      filtered = filtered.filter(
        (u) =>
          u.usuario!.toLowerCase().includes(this.search.toLowerCase()) ||
          u.nombres!.toLowerCase().includes(this.search.toLowerCase())
      );
    }

    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    const filteredLength = this.usuarios.filter(
      (u) =>
        u.usuario!.toLowerCase().includes(this.search.toLowerCase()) ||
        u.nombres!.toLowerCase().includes(this.search.toLowerCase())
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
