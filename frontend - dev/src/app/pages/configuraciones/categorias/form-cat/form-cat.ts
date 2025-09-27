import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Categoria } from '../../../../interfaces/categorias';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriasService } from '../../../../services/categorias.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-cat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-cat.html',
  styleUrl: './form-cat.scss',
})
export class FormCat {
  fb = inject(FormBuilder);
  catService = inject(CategoriasService);

  @Input() categoria: Categoria | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  catForm = this.fb.group({
    id: [0],
    categoria: ['', [Validators.required]],
    estado: [true, [Validators.required]],
    descripcion: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoria'] && this.categoria) {
      this.catForm.patchValue(this.categoria);
      if (this.modo === 'ver') {
        this.catForm.disable();
      } else {
        this.catForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.catForm.reset();
      this.catForm.enable();
    }
  }
  save() {
    const { id, categoria, estado, descripcion } = this.catForm.value;
    if (this.modo === 'crear') {
      this.catService.crearCategoria(categoria!, estado!, descripcion!).subscribe((ok) => {
        if (ok === true) {
          Swal.fire('Exito', 'Categoria creado exitosamente', 'success');
        } else {
          Swal.fire('Error', 'Error al crear Categoria', 'error');
        }
        this.catForm.reset();
      });
    } else if (this.modo === 'editar') {
      this.catService.editarCategoria(id!, categoria!, estado!, descripcion!).subscribe((ok) => {
        if (ok === true) {
          Swal.fire('Exito', 'Categoria editada exitosamente', 'success');
        } else {
          Swal.fire('Error', 'Error al editar Categoria', 'error');
        }
        this.catForm.reset();
      });
    }
  }
}
