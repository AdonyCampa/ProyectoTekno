export interface Rol {
  id?: number;
  rol?: string;
  descripcion?: string;
}

export interface RolResponse {
  ok?: boolean;
  msg?: string;
  rol: Rol;
}
