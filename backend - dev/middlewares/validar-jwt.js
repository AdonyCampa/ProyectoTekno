const { response } = require('express');
const jwt = require('jsonwebtoken');

const {
    handleHttpError,
    handleErrorResponse,
} = require("../helpers/handleError");


const validarJWT = ( req, res = response, next ) => {

    const token = req.header('x-token');

    if( !token  ) {
        handleErrorResponse(res, "Error en el token", 401);
        return;
    }

    try {

        const { id, usuario } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        req.id  = id;
        req.usuario = usuario;

        
    } catch (error) {
        handleErrorResponse(res, "Token no válido", 401);
        return;
    }



    // TODO OK!
    next();
}


module.exports = {
    validarJWT
}

