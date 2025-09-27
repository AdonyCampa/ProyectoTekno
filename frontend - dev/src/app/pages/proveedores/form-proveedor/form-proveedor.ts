import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProveedoresService } from '../../../services/proveedores.service';
import Swal from 'sweetalert2';
import { Proveedor } from '../../../interfaces/proveedores';

@Component({
  selector: 'app-form-proveedor',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-proveedor.html',
  styleUrl: './form-proveedor.scss',
})
export class FormProveedor {
  fb = inject(FormBuilder);
  proveedorService = inject(ProveedoresService);

  @Input() proveedor: Proveedor | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  proveedorForm = this.fb.group({
    id: [0],
    empresa: ['', [Validators.required]],
    contacto: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    correo: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    estado: [true, [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proveedor'] && this.proveedor) {
      this.proveedorForm.patchValue(this.proveedor);
      if (this.modo === 'ver') {
        this.proveedorForm.disable();
      } else {
        this.proveedorForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.proveedorForm.reset();
      this.proveedorForm.enable();
    }
  }
  save() {
    const { id, empresa, contacto, telefono, correo, direccion, estado } = this.proveedorForm.value;
    if (this.modo === 'crear') {
      this.proveedorService
        .crearProveedor(empresa!, contacto!, telefono!, correo!, direccion!, estado!)
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Proveedor creado exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al crear Proveedor', 'error');
          }
          this.proveedorForm.reset();
        });
    } else if (this.modo === 'editar') {
      this.proveedorService
        .editarProveedor(id!, empresa!, contacto!, telefono!, correo!, direccion!, estado!)
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Proveedor editada exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al editar Proveedor', 'error');
          }
          this.proveedorForm.reset();
        });
    }
  }
}
