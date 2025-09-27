export interface Proveedor {
  id?: number;
  empresa?: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  estado?: boolean;
}

export interface ProveedorResponse {
  ok?: boolean;
  msg?: string;
  proveedor: Proveedor;
}
