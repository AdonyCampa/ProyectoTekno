const { response } = require('express');
const Renglon = require('../models/renglones');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver Renglon
const getRenglon = async(req, res = response) => {

    try {
        // Ver Renglon seleccionado
        const { id } = req.params;
        const renglon = await Renglon.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !renglon ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ renglon });
    } catch (error) {
        handleHttpError(res, "ERROR GET Renglon");
    }
}

// Ver Renglons
const getRenglones = async(req, res = response) => {

    try {
        // Obtener datos
        const renglones = await Renglon.findAll();
        // Mostrar datos
        res.send( renglones );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Renglones");
    }
}

// Agregar un Renglon nuevo
const createRenglon = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        // Verificar la existencia del Renglon
        const checkIsExist = await Renglon.findOne({ where : {nombre: body.nombre} });
        if (checkIsExist) {
            handleErrorResponse(res, "RENGLON_EXISTS", 401);
            return;
        }

        // Crear Renglon de DB
        const renglon = await Renglon.create(body);
        const data = {
            ok: true,
            msg: 'Renglon creado exitosamente',
            renglon
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE Renglon")
    }
}

// Editar Renglon seleccionado
const updateRenglon = async(req, res = response) => {

    try {
        // Editar Renglon seleccionado
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        const renglon = await Renglon.findByPk( id );
        // Checkear si el Renglon existe
        if(!renglon) {
            handleErrorResponse(res, "RENGLON_NOT_EXISTS", 404);
            return;
        }

        // verificar si el nombre ya existe en la DB
        if(!body.nombre === renglon.nombre){
            const checkIsExist = await Renglon.findOne({ where : {nombre: body.nombre} });
            if (checkIsExist) {
                handleErrorResponse(res, "RENGLON_EXISTS", 401);
                return;
            }
        }

        await renglon.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Renglon actualizado exitosamente',
            renglon
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE Renglon")
    }
}

// Eliminar Renglon
const deleteRenglon = async(req, res = response) => {

    try {
        // Eliminar Renglon seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const renglon = await Renglon.findByPk( id );
        if(!renglon) {
            handleErrorResponse(res, "RENGLON_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Renglon este inactivo

        // Eliminando datos
        await renglon.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Renglon eliminado exitosamente',
            renglon
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE Renglon")
    }
}

module.exports = {
    getRenglon,
    getRenglones,
    createRenglon,
    updateRenglon,
    deleteRenglon
}