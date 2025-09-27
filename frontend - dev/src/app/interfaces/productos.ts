export interface Producto {
  id?: number;
  producto?: string;
  stockmin?: number;
  stockmax?: number;
  medida?: number;
  medida_name?: string;
  categoria?: number;
  categoria_name?: string;
  marca?: number;
  marca_name?: string;
  precio_venta?: number;
  precio_costo?: number;
  imagen?: string;
  estado?: boolean;
  descripcion?: string;
}

export interface ProductoResponse {
  ok?: boolean;
  msg?: string;
  producto: Producto;
}
