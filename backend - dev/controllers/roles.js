const { response } = require('express');

const { encrypt, compare } = require('../helpers/handleJwt');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver rol
const getRol = async (req, res = response) => {
    console.log("Ver rol");
    /*     try {
            // Ver usuario seleccionado
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            // Comprobar si existe el id ingresado
            if( !usuario ){
                // Mostrar mensaje de error
                handleErrorResponse(res, "ID_NO_EXISTS", 404);
                return;           
            }
            // Generar respuesta exitosa
            res.send(usuario);
        } catch (error) {
            handleHttpError(res, "ERROR GET USUARIO");
        } */
}

// Ver roles
const getRoles = async (req, res = response) => {
    console.log("Ver roles");
    /*     try {
            // Obtener datos
            const usuarios = await Usuario.findAll();
            // Mostrar datos
            res.send( usuarios );
        } catch (error) {
            // Mostrar mensaje de error en la peticion
            handleHttpError(res, "ERROR GET USUARIOS");
        } */
}

// Agregar un rol nuevo
const createRol = async (req, res = response) => {
    console.log("Agregar nuevo rol");

    /*     try {
            const { repeatpassword } = req.body;
            
            // Limpiar los datos
            const body = matchedData(req);
            // Verificar la existencia del usuario
            const checkIsExist = await Usuario.findOne({ where : {usuario: body.usuario} });
            if (checkIsExist) {
                handleErrorResponse(res, "USER_EXISTS", 401);
                return;
            }
            // Verificar que las contraseñas coincidan
            if(!(body.password === repeatpassword)){
                handleErrorResponse(res, "PASWORD_DOES_NOT_MATCH", 400);
                return;
            }
            // Obtener los datos
            const password = await encrypt(body.password);
            // Hashear la contraseña
            const bodyInsert = { ...body, password };
            // Crear usuario de DB
            const usuario = await Usuario.create(bodyInsert);
            const data = {
                ok: true,
                msg: 'Usuario creado exitosamente',
                usuario
            };
            // Generar respuesta exitosa
            res.send(data);   
        } catch (error) {
            handleHttpError(res, "ERROR CREATE USUARIO")
        } */
}

// Editar rol seleccionado
const updateRol = async (req, res = response) => {
    console.log("Editar rol");

    /*     try {
            // Editar usuario seleccionado
            const { id } = req.params;
            const { body } = req;
            const usuario = await Usuario.findByPk( id );
    
            // Checkear si el usuario existe
            if(!usuario) {
                handleErrorResponse(res, "USER_NOT_EXISTS", 404);
                return;
            }
    
            const checkIsExist = await Usuario.findOne({ where : {usuario: body.usuario} });
            if (checkIsExist && !usuario.usuario === body.usuario) {
                handleErrorResponse(res, "USER_EXISTS", 401);
                return;
            } 
            await usuario.update(body);
            // Generar respuesta exitosa
            const data = {
                ok: true,
                msg: 'Usuario creado exitosamente',
                usuario
            }
            res.send(data);
        } catch (error) {
            handleHttpError(res, "ERROR UPDATE USUARIO")
        } */
}

// Eliminar rol
const deleteRol = async (req, res = response) => {
    console.log("Eliminar rol");

    /* 
        try {
            // Eliminar usuario seleccionado
            const { id } = req.params;
            const { body } = req
            console.log(req);
            // Buscar si existe el registro
            const usuario = await Usuario.findByPk( id );
            if(!usuario) {
                handleErrorResponse(res, "USER_NOT_EXISTS", 404);
                return;
            }
    
            // Comprobar que el usuario este inactivo
            if(!usuario.estado === false) {
                handleErrorResponse(res, "USER_ACTIVE", 404);
                return;
            }
            // Eliminando datos
            await usuario.destroy(body);
    
            // Generar respuesta exitosa
            const data = {
                ok: true,
                msg: 'Usuario eliminado exitosamente',
                usuario
            }
            res.send(data);
    
        } catch (error) {
            handleHttpError(res, "ERROR DELETE USUARIO")
        } */
}

module.exports = {
    getRol,
    getRoles,
    createRol,
    updateRol,
    deleteRol
}