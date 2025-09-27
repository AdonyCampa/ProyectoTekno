import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../../services/productos.service';
import Swal from 'sweetalert2';
import { Producto } from '../../../interfaces/productos';

@Component({
  selector: 'app-form-producto',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-producto.html',
  styleUrl: './form-producto.scss',
})
export class FormProducto {
  fb = inject(FormBuilder);
  productoService = inject(ProductosService);

  @Input() producto: Producto | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  productoForm = this.fb.group({
    id: [0],
    producto: ['', [Validators.required]],
    stockmin: [0, [Validators.required]],
    stockmax: [0, [Validators.required]],
    categoria: [0, [Validators.required]],
    marca: [0, [Validators.required]],
    medida: [0, [Validators.required]],
    precio_venta: [0, [Validators.required]],
    precio_costo: [0, [Validators.required]],
    descripcion: ['', [Validators.required]],
    estado: [true, [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['producto'] && this.producto) {
      this.productoForm.patchValue(this.producto);
      if (this.modo === 'ver') {
        this.productoForm.disable();
      } else {
        this.productoForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.productoForm.reset();
      this.productoForm.enable();
    }
  }
  save() {
    const {
      id,
      producto,
      stockmin,
      stockmax,
      categoria,
      marca,
      medida,
      precio_venta,
      precio_costo,
      descripcion,
      estado,
    } = this.productoForm.value;
    if (this.modo === 'crear') {
      this.productoService
        .crearProducto(
          producto!,
          stockmin!,
          stockmax!,
          categoria!,
          marca!,
          medida!,
          precio_venta!,
          precio_costo!,
          descripcion!,
          estado!
        )
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Productocreado exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al crear Producto', 'error');
          }
          this.productoForm.reset();
        });
    } else if (this.modo === 'editar') {
      this.productoService
        .editarProducto(
          id!,
          producto!,
          stockmin!,
          stockmax!,
          categoria!,
          marca!,
          medida!,
          precio_venta!,
          precio_costo!,
          descripcion!,
          estado!
        )
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Productoeditada exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al editar Producto', 'error');
          }
          this.productoForm.reset();
        });
    }
  }
}
