const { response } = require('express');
const NivelAcademico = require('../models/nivelesAcademicos');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver NivelAcademico
const getNivelAcademico = async(req, res = response) => {

    try {
        // Ver NivelAcademico seleccionado
        const { id } = req.params;
        const nivelAcademico = await NivelAcademico.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !nivelAcademico ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ nivelAcademico });
    } catch (error) {
        handleHttpError(res, "ERROR GET NivelAcademico");
    }
}

// Ver NivelAcademicos
const getNivelesAcademicos = async(req, res = response) => {

    try {
        // Obtener datos
        const nivelAcademicos = await NivelAcademico.findAll();
        // Mostrar datos
        res.send( nivelAcademicos );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET NivelesAcademicos");
    }
}

// Agregar un NivelAcademico nuevo
const createNivelAcademico = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        // Verificar la existencia del NivelAcademico
        const checkIsExist = await NivelAcademico.findOne({ where : {nombre: body.nombre} });
        if (checkIsExist) {
            handleErrorResponse(res, "NIVEL_EXISTS", 401);
            return;
        }

        // Crear NivelAcademico de DB
        const nivelAcademico = await NivelAcademico.create(body);
        const data = {
            ok: true,
            msg: 'NivelAcademico creado exitosamente',
            nivelAcademico
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE NivelAcademico")
    }
}

// Editar NivelAcademico seleccionado
const updateNivelAcademico = async(req, res = response) => {

    try {
        // Editar NivelAcademico seleccionado
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        const nivelAcademico = await NivelAcademico.findByPk( id );
        // Checkear si el NivelAcademico existe
        if(!nivelAcademico) {
            handleErrorResponse(res, "NIVEL_NOT_EXISTS", 404);
            return;
        }
        // verificar si el nombre ya existe en la DB
        if(!body.nombre === nivelAcademico.nombre){
            const checkIsExist = await NivelAcademico.findOne({ where : {nombre: body.nombre} });
            if (checkIsExist) {
                handleErrorResponse(res, "NIVEL_EXISTS", 401);
                return;
            }
        }
        await nivelAcademico.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'NivelAcademico creada exitosamente',
            nivelAcademico
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE NivelAcademico")
    }
}

// Eliminar NivelAcademico
const deleteNivelAcademico = async(req, res = response) => {

    try {
        // Eliminar NivelAcademico seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const nivelAcademico = await NivelAcademico.findByPk( id );
        if(!nivelAcademico) {
            handleErrorResponse(res, "NIVEL_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el NivelAcademico este inactivo

        // Eliminando datos
        await nivelAcademico.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'NivelAcademico eliminada exitosamente',
            nivelAcademico
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE NivelAcademico")
    }
}

module.exports = {
    getNivelAcademico,
    getNivelesAcademicos,
    createNivelAcademico,
    updateNivelAcademico,
    deleteNivelAcademico
}