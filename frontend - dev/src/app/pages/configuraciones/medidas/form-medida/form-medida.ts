import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedidasService } from '../../../../services/medidas.service';
import Swal from 'sweetalert2';
import { Medida } from '../../../../interfaces/medidas';

@Component({
  selector: 'app-form-medida',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-medida.html',
  styleUrl: './form-medida.scss',
})
export class FormMedida {
  fb = inject(FormBuilder);
  medidaService = inject(MedidasService);

  @Input() medida: Medida | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  medidaForm = this.fb.group({
    id: [0],
    medida: ['', [Validators.required]],
    abreviatura: ['', [Validators.required]],
    estado: [true, [Validators.required]],
    descripcion: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medida'] && this.medida) {
      this.medidaForm.patchValue(this.medida);
      if (this.modo === 'ver') {
        this.medidaForm.disable();
      } else {
        this.medidaForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.medidaForm.reset();
      this.medidaForm.enable();
    }
  }
  save() {
    const { id, medida, abreviatura, estado, descripcion } = this.medidaForm.value;
    if (this.modo === 'crear') {
      this.medidaService
        .crearMedida(medida!, abreviatura!, estado!, descripcion!)
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Medida creado exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al crear Medida', 'error');
          }
          this.medidaForm.reset();
        });
    } else if (this.modo === 'editar') {
      this.medidaService
        .editarMedida(id!, medida!, abreviatura!, estado!, descripcion!)
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Medida editada exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al editar Medida', 'error');
          }
          this.medidaForm.reset();
        });
    }
  }
}
