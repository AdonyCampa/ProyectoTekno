export interface Apertura {
  id?: number;
  usuario?: number;
  apertura?: Date;
  cierre?: Date;
  monto_inicial?: number;
  monto_final?: number;
  estado?: boolean;
  descripcion?: string;
}

export interface AperturaResponse {
  ok?: boolean;
  msg?: string;
  apertura: Apertura;
}

export interface MovimientoCaja {
  id?: number;
  apertura?: number;
  asunto?: boolean;
  concepto?: string;
  monto?: number;
  fecha?: Date;
}

export interface MovimientoResponse {
  ok?: boolean;
  msg?: string;
  movimiento: MovimientoCaja;
}
