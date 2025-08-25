const { response } = require('express');
const Usuario = require('../models/usuarios');
const { compare } = require('../helpers/handleJwt');
const { generarJWT } = require('../helpers/jwt');
const {
    handleHttpError,
    handleErrorResponse,
} = require("../helpers/handleError");


// Ingresar al sistema
const loginUsuario = async(req, res = response) => {

    const { usuario, password } = req.body;
    try {
        // Buscar usuario en la base de datos
        const dbUser = await Usuario.findOne({ where : {usuario: usuario} });
        console.log(dbUser);
        if(  !dbUser ) {
            handleErrorResponse(res, "USER_NOT_EXISTS", 404);
            return;
        }
        // Verificar estado del usuario 
        if(!dbUser.estado){
            handleErrorResponse(res, "INACTIVE_STATE", 402);
            return;
        }

        // Confirmar si el password hace match
        const validPassword = await compare(password, dbUser.password );
        if ( !validPassword ) {
            handleErrorResponse(res, "PASSWORD_INVALID", 402);
            return;
        }
        // Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.usuario );
        // Respuesta del servicio
        const data = {
            ok: true,
            id: dbUser.id,
            usuario: dbUser.usuario,
            nombres: dbUser.nombres,
            token: token,
            rol: dbUser.rol,
            estado: dbUser.estado
        };
        res.send(data);
    } catch (e) {
        handleHttpError(res, e);
    }

}

const revalidarToken = async(req, res = response ) => {
    const { id, usuario } = req;
    // Buscar usuario en la base de datos
    const dbUser = await Usuario.findByPk(id);
    // Generar el JWT
    const token = await generarJWT( id, usuario );
    // Respuesta del servidor
    const data = {
        ok: true,
        id: dbUser.id, 
        usuario: dbUser.usuario,
        token,
        nombres: dbUser.nombres,
        rol: dbUser.rol,
        estado: dbUser.estado

    };
    res.send( data );

}



module.exports = {
    loginUsuario,
    revalidarToken
}