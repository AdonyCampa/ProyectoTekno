import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { CajaMovimientosService } from '../../../services/caja-movimientos.service';
import { Apertura, MovimientoCaja } from '../../../interfaces/caja';

@Component({
  selector: 'app-form-movimiento',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-movimiento.html',
  styleUrl: './form-movimiento.scss',
})
export class FormMovimiento {
  fb = inject(FormBuilder);
  movService = inject(CajaMovimientosService);

  @Input() movimiento: MovimientoCaja | null = null;
  @Input() caja: Apertura | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  movForm = this.fb.group({
    id: [0],
    asunto: [false, [Validators.required]],
    concepto: ['', [Validators.required]],
    monto: [0, [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movimiento'] && this.movimiento) {
      this.movForm.patchValue(this.movimiento);
      if (this.modo === 'ver') {
        this.movForm.disable();
      } else {
        this.movForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.movForm.reset();
      this.movForm.enable();
    }
  }
  save() {
    const { id, asunto, concepto, monto } = this.movForm.value;
    if (this.modo === 'crear') {
      this.movService.MovimientoCaja(this.caja?.id!, asunto!, concepto!, monto!).subscribe((ok) => {
        if (ok === true) {
          Swal.fire('Exito', 'Movimiento de caja registrado exitosamente', 'success');
        } else {
          Swal.fire('Error', 'Error al registrar movimiento de caja', 'error');
        }
        this.movForm.reset();
      });
    } else if (this.modo === 'editar') {
      this.movService
        .EditarMovimiento(id!, this.caja?.id!, asunto!, concepto!, monto!)
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Movimiento de caja editado exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al editar movimiento de caja', 'error');
          }
          this.movForm.reset();
        });
    }
  }
}
