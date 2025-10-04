import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { CajaAperturasService } from '../../../services/caja-aperturas.service';
import { Apertura } from '../../../interfaces/caja';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-form-apertura',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-apertura.html',
  styleUrl: './form-apertura.scss',
})
export class FormApertura {
  userInfo = inject(AuthService);
  fb = inject(FormBuilder);
  cajaService = inject(CajaAperturasService);

  @Input() modo: 'apertura' | 'cierre' | 'ver' = 'apertura';

  cajaForm = this.fb.group({
    monto_inicial: [0, [Validators.required]],
  });

  save() {
    const { monto_inicial } = this.cajaForm.value;
    this.cajaService.AperturarCaja(this.userInfo.user()?.id!, monto_inicial!).subscribe((ok) => {
      if (ok === true) {
        Swal.fire('Exito', 'Caja aperturada exitosamente', 'success');
      } else {
        Swal.fire('Error', 'Error al aperturar Caja', 'error');
      }
      this.cajaForm.reset();
    });
  }
}
