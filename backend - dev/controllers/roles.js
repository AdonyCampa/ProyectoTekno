const { response } = require('express');
const Rol = require('../models/roles');

const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver rol
const getRol = async (req, res = response) => {
    try {
        // Obtener datos desde el frontend
        const { id } = req.params;
        const rol = await Rol.findByPk(id);

        // Comprobar si existe el id ingresado
        if (!rol) {
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID Rol no existe", 404);
            return;
        }
        // Generar respuesta exitosa
        res.send(rol);
    } catch (error) {
        handleHttpError(res, "Error al buscar rol");

    }
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
    try {
        // Obtener datos
        const roles = await Rol.findAll();

        // Mostrar datos
        res.send(roles);

    } catch (error) {

        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "Error al obtener roles");

    }
}

// Agregar un rol nuevo
const createRol = async (req, res = response) => {
    try {
        // Limpiar los datos
        const body = matchedData(req);
        // Verificar la existencia del rol
        const checkIsExist = await Rol.findOne({ where: { rol: body.rol } });
        if (checkIsExist) {
            handleErrorResponse(res, "Rol Existente", 401);
            return;
        }
        // Crear nuevo rol
        const rol = await Rol.create(body);
        const data = {
            ok: true,
            msg: 'Rol creado exitosamente',
            rol
        };
        // Generar respuesta exitosa
        res.send(data);

    } catch (error) {
        // Error al crear el rol
        handleHttpError(res, "Error al crear Rol!")
    }

}

// Editar rol seleccionado
const updateRol = async (req, res = response) => {
    try {
        // Limpiar los datos
        const { id } = req.params;
        const body = matchedData(req);

        // Checkear id rol existente
        const rol = await Rol.findByPk(id);

        if (!rol) {
            handleErrorResponse(res, "El rol no existe", 404);
            return;
        }

        await rol.update(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Rol editado exitosamente',
            body,
        }

        res.send(data);

    } catch (error) {
        // Error al editar el rol
        handleHttpError(res, "Error al editar Rol!")
    }
}

// Eliminar rol
const deleteRol = async (req, res = response) => {
    try {
        // Eliminar usuario seleccionado
        const { id } = req.params;
        // Buscar si existe el registro
        const rol = await Rol.findByPk(id);
        if (!rol) {
            handleErrorResponse(res, "Rol no existente", 404);
            return;
        }
        // Eliminando datos
        await rol.destroy(rol);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Usuario eliminado exitosamente',
            rol
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "Error al eliminar ro");
    }
}

module.exports = {
    getRol,
    getRoles,
    createRol,
    updateRol,
    deleteRol
}