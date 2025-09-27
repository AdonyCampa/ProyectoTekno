export interface Medida {
  id?: number;
  medida?: string;
  abreviatura?: string;
  estado?: boolean;
  descripcion?: string;
}

export interface MedidaResponse {
  ok?: boolean;
  msg?: string;
  medida: Medida;
}
