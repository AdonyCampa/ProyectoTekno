export interface Usuario {
  id?: number;
  usuario: string;
  nombres: string;
  apellidos: string;
  password: string;
  rol: number;
  imagen?: string;
  estado?: boolean;
  correo?: string;
  direccion?: string;
  newpassword?: string;
  repeatpassword?: string;
}

export interface AuthResponse {
  ok?: boolean;
  msg?: string;
  usuario: Usuario;
  token: string;
}

export interface UsuarioResponse {
  ok?: boolean;
  msg?: string;
}

export interface UsuarioPass {
  id?: number;
  newpassword?: string;
  repeatpassword?: string;
}
