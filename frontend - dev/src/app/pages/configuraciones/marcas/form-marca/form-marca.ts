import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarcasService } from '../../../../services/marcas.service';
import Swal from 'sweetalert2';
import { Marca } from '../../../../interfaces/marcas';

@Component({
  selector: 'app-form-marca',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-marca.html',
  styleUrl: './form-marca.scss',
})
export class FormMarca {
  fb = inject(FormBuilder);
  marcaService = inject(MarcasService);

  @Input() marca: Marca | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  marcaForm = this.fb.group({
    id: [0],
    marca: ['', [Validators.required]],
    estado: [true, [Validators.required]],
    descripcion: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['marca'] && this.marca) {
      this.marcaForm.patchValue(this.marca);
      if (this.modo === 'ver') {
        this.marcaForm.disable();
      } else {
        this.marcaForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.marcaForm.reset();
      this.marcaForm.enable();
    }
  }
  save() {
    const { id, marca, estado, descripcion } = this.marcaForm.value;
    if (this.modo === 'crear') {
      this.marcaService.crearMarca(marca!, estado!, descripcion!).subscribe((ok) => {
        if (ok === true) {
          Swal.fire('Exito', 'Marca creado exitosamente', 'success');
        } else {
          Swal.fire('Error', 'Error al crear Marca', 'error');
        }
        this.marcaForm.reset();
      });
    } else if (this.modo === 'editar') {
      this.marcaService.editarMarca(id!, marca!, estado!, descripcion!).subscribe((ok) => {
        if (ok === true) {
          Swal.fire('Exito', 'Marca editada exitosamente', 'success');
        } else {
          Swal.fire('Error', 'Error al editar Marca', 'error');
        }
        this.marcaForm.reset();
      });
    }
  }
}
