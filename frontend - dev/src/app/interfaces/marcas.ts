export interface Marca {
  id?: number;
  marca?: string;
  estado?: boolean;
  descripcion?: string;
}

export interface MarcaResponse {
  ok?: boolean;
  msg?: string;
  marca: Marca;
}
