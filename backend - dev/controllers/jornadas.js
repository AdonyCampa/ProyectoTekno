const { response } = require('express');
const Jornada = require('../models/jornadas');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver Jornada
const getJornada = async(req, res = response) => {

    try {
        // Ver Jornada seleccionado
        const { id } = req.params;
        const jornada = await Jornada.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !jornada ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ jornada });
    } catch (error) {
        handleHttpError(res, "ERROR GET Jornada");
    }
}

// Ver Jornadas
const getJornadas = async(req, res = response) => {

    try {
        // Obtener datos
        const jornadas = await Jornada.findAll();
        // Mostrar datos
        res.send( jornadas );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Jornadas");
    }
}

// Agregar un Jornada nuevo
const createJornada = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { nombre, hora_inicio, hora_fin, descripcion} = req.body;
        const body = { nombre, hora_inicio, hora_fin, descripcion};
        // Verificar la existencia del Jornada
        const checkIsExist = await Jornada.findOne({ where : {nombre: body.nombre} });
        if (checkIsExist) {
            handleErrorResponse(res, "JORNADA_EXISTS", 401);
            return;
        }
        // Crear Jornada de DB
        const jornada = await Jornada.create(body);
        const data = {
            ok: true,
            msg: 'Jornada creado exitosamente',
            jornada
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE Jornada")
    }
}

// Editar Jornada seleccionado
const updateJornada = async(req, res = response) => {

    try {
        // Editar Jornada seleccionado
        const { id } = req.params;
        const { nombre, hora_inicio, hora_fin, descripcion} = req.body;
        const body = { nombre, hora_inicio, hora_fin, descripcion};

        const jornada = await Jornada.findByPk( id );
        // Checkear si el Jornada existe
        if(!jornada) {
            handleErrorResponse(res, "Jornada_NOT_EXISTS", 404);
            return;
        }
        // verificar si el nombre ya existe en la DB
        if(!body.nombre === jornada.nombre){
            const checkIsExist = await Jornada.findOne({ where : {nombre: body.nombre} });
            if (checkIsExist) {
                handleErrorResponse(res, "JORNADA_EXISTS", 401);
                return;
            }
        }
        await jornada.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Jornada creada exitosamente',
            jornada
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE Jornada")
    }
}

// Eliminar Jornada
const deleteJornada = async(req, res = response) => {

    try {
        // Eliminar Jornada seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const jornada = await Jornada.findByPk( id );
        if(!jornada) {
            handleErrorResponse(res, "JORNADA_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Jornada este inactivo

        // Eliminando datos
        await jornada.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Jornada eliminada exitosamente',
            jornada
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE Jornada")
    }
}

module.exports = {
    getJornada,
    getJornadas,
    createJornada,
    updateJornada,
    deleteJornada
}