export interface Categoria {
  id?: number;
  categoria?: string;
  estado?: boolean;
  descripcion?: string;
}

export interface CategoriaResponse {
  ok?: boolean;
  msg?: string;
  categoria: Categoria;
}
