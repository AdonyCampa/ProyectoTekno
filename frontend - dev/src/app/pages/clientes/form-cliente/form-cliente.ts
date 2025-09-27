import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../services/clientes.service';
import Swal from 'sweetalert2';
import { Cliente } from '../../../interfaces/clientes';

@Component({
  selector: 'app-form-cliente',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-cliente.html',
  styleUrl: './form-cliente.scss',
})
export class FormCliente {
  fb = inject(FormBuilder);
  clienteService = inject(ClientesService);

  @Input() cliente: Cliente | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  clienteForm = this.fb.group({
    id: [0],
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    dpi: ['', [Validators.required]],
    nit: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    correo: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    estado: [true, [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] && this.cliente) {
      this.clienteForm.patchValue(this.cliente);
      if (this.modo === 'ver') {
        this.clienteForm.disable();
      } else {
        this.clienteForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.clienteForm.reset();
      this.clienteForm.enable();
    }
  }
  save() {
    const { id, nombres, apellidos, dpi, nit, telefono, correo, direccion, estado } =
      this.clienteForm.value;
    if (this.modo === 'crear') {
      this.clienteService
        .crearCliente(nombres!, apellidos!, dpi!, nit!, telefono!, correo!, direccion!, estado!)
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Cliente creado exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al crear Cliente', 'error');
          }
          this.clienteForm.reset();
        });
    } else if (this.modo === 'editar') {
      this.clienteService
        .editarCliente(
          id!,
          nombres!,
          apellidos!,
          dpi!,
          nit!,
          telefono!,
          correo!,
          direccion!,
          estado!
        )
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Client editada exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al editar Client', 'error');
          }
          this.clienteForm.reset();
        });
    }
  }
}
