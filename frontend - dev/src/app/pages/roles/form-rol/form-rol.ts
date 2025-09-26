import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolService } from '../../../services/roles.service';
import { Rol } from '../../../interfaces/roles';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-rol',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-rol.html',
  styleUrl: './form-rol.scss',
})
export class FormRol implements OnChanges {
  fb = inject(FormBuilder);
  rolService = inject(RolService);

  @Input() rol: Rol | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  rolForm = this.fb.group({
    id: [0],
    rol: ['', [Validators.required]],
    descripcion: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rol'] && this.rol) {
      this.rolForm.patchValue(this.rol);
      if (this.modo === 'ver') {
        this.rolForm.disable();
      } else {
        this.rolForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.rolForm.reset();
      this.rolForm.enable();
    }
  }
  save() {
    const { id, rol, descripcion } = this.rolForm.value;
    if (this.modo === 'crear') {
      this.rolService.crearRol(rol!, descripcion!).subscribe((ok) => {
        if (ok === true) {
          Swal.fire('Exito', 'Rol creado exitosamente', 'success');
        } else {
          Swal.fire('Eror', 'Error al crear Rol', 'error');
        }
        this.rolForm.reset();
      });
    } else if (this.modo === 'editar') {
      this.rolService.editarRol(id!, rol!, descripcion!).subscribe((ok) => {
        if (ok === true) {
          Swal.fire('Exito', 'Rol editado exitosamente', 'success');
        } else {
          Swal.fire('Eror', 'Error al editar Rol', 'error');
        }
        this.rolForm.reset();
      });
    }
  }
}
