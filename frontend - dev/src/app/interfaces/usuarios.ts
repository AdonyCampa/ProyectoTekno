export interface Usuario {
    id?: number,
    usuario?: string,
    nombres?: string,
    password?: string,
    rol?: string,
    imagen?: string,
    estado?: boolean,
    newpassword?: string,
    repeatpassword?: string
}

export interface AuthResponse {
    ok?: boolean,
    msg?: string,
    id?: number,
    usuario?: string,
    nombres?: string,
    rol?: string,
    estado?: boolean,
    token?: string
}

export interface UsuarioResponse {
    ok?: boolean,
    msg?: string,
}

export interface UsuarioPass {
    id?: number,
    newpassword?: string,
    repeatpassword?: string,
}