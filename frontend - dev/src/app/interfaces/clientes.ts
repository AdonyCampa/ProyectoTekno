export interface Cliente {
  id?: number;
  nombres?: string;
  apellidos?: string;
  dpi?: string;
  nit?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  estado?: boolean;
}

export interface ClienteResponse {
  ok?: boolean;
  msg?: string;
  cliente: Cliente;
}
