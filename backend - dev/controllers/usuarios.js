const { response } = require('express');
const Usuario = require('../models/usuarios');
const { encrypt, compare } = require('../helpers/handleJwt');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver usuario
const getUsuario = async (req, res = response) => {

    try {
        // Ver usuario seleccionado
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        // Comprobar si existe el id ingresado
        if (!usuario) {
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;
        }
        // Generar respuesta exitosa
        res.send(usuario);
    } catch (error) {
        handleHttpError(res, "ERROR GET USUARIO");
    }
}

// Ver usuarios
const getUsuarios = async (req, res = response) => {

    try {
        // Obtener datos
        const usuarios = await Usuario.findAll();
        // Mostrar datos
        res.send(usuarios);
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET USUARIOS");
    }
}

// Agregar un usuario nuevo
const createUsuario = async (req, res = response) => {

    try {
        const { repeatpassword } = req.body;

        // Limpiar los datos
        const body = matchedData(req);

        // Verificar la existencia del usuario
        const checkIsExist = await Usuario.findOne({ where: { usuario: body.usuario } });
        if (checkIsExist) {
            handleErrorResponse(res, "USER_EXISTS", 401);
            return;
        }
        // Verificar que las contraseñas coincidan
        if (!(body.password === repeatpassword)) {
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

        handleHttpError(res, "ERROR al crear Usuario")
    }
}

// Editar usuario seleccionado
const updateUsuario = async (req, res = response) => {

    try {
        // Editar usuario seleccionado
        const { id } = req.params;
        const { body } = req;
        const usuario = await Usuario.findByPk(id);

        // Checkear si el usuario existe
        if (!usuario) {
            handleErrorResponse(res, "USER_NOT_EXISTS", 404);
            return;
        }

        const checkIsExist = await Usuario.findOne({ where: { usuario: body.usuario } });
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
    }
}

// Editar contraseña de usuario
const updatePasswordUsuario = async (req, res = response) => {

    try {
        // Editar usuario seleccionado
        const { id } = req.params;
        const { newpassword, repeatpassword } = req.body;
        const usuario = await Usuario.findByPk(id);


        // Checkear si el usuario existe
        if (!usuario) {
            handleErrorResponse(res, "USER_NOT_EXISTS", 404);
            return;
        }

        // Verificar que las contraseñas coincidan
        if (!(newpassword === repeatpassword)) {
            handleErrorResponse(res, "PASWORD_DOES_NOT_MATCH", 400);
            return;
        }

        // Verificar si la nueva contraseña no es igual a la antigua
        const oldpassword = await compare(newpassword, usuario.password);

        if (oldpassword) {
            handleErrorResponse(res, "PASWORD_SAME_AS_OLD", 400);
            return;
        }

        // Actualizar contraseña
        const password = await encrypt(newpassword);
        await usuario.update({ password });
        //Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Contraseña actualizada exitosamente',
            usuario
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE PASSWORD USUARIO")
    }
}

// Eliminar usuario
const deleteUsuario = async (req, res = response) => {

    try {
        // Eliminar usuario seleccionado
        const { id } = req.params;
        const { body } = req
        console.log(req);
        // Buscar si existe el registro
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            handleErrorResponse(res, "USER_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el usuario este inactivo
        if (!usuario.estado === false) {
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
    }
}

module.exports = {
    getUsuario,
    getUsuarios,
    createUsuario,
    updateUsuario,
    updatePasswordUsuario,
    deleteUsuario
}