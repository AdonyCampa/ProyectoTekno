import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { CajaAperturasService } from '../../../services/caja-aperturas.service';
import { Apertura } from '../../../interfaces/caja';

@Component({
  selector: 'app-form-cerrar',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-cerrar.html',
  styleUrl: './form-cerrar.scss',
})
export class FormCerrar {
  fb = inject(FormBuilder);
  cajaService = inject(CajaAperturasService);

  @Input() modo: 'apertura' | 'cierre' | 'ver' = 'apertura';
  @Input() apertura: Apertura | null = null;

  cajaForm = this.fb.group({
    monto_final: [0, [Validators.required]],
  });

  save() {
    const { monto_final } = this.cajaForm.value;
    this.cajaService.CerrarCaja(this.apertura?.id!, monto_final!).subscribe((ok) => {
      if (ok === true) {
        Swal.fire('Exito', 'Caja cerrada exitosamente', 'success');
      } else {
        Swal.fire('Error', 'Error al cerrar Caja', 'error');
      }
      this.cajaForm.reset();
    });
  }
}
