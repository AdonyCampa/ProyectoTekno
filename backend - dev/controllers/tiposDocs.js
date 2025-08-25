const { response } = require('express');
const TipoDoc = require('../models/tiposDocs');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver TipoDoc
const getTipoDoc = async(req, res = response) => {

    try {
        // Ver TipoDoc seleccionado
        const { id } = req.params;
        const tipoDoc = await TipoDoc.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !tipoDoc ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ tipoDoc });
    } catch (error) {
        handleHttpError(res, "ERROR GET TipoDoc");
    }
}

// Ver TipoDocs
const getTiposDocs = async(req, res = response) => {

    try {
        // Obtener datos
        const tiposDocs = await TipoDoc.findAll();
        // Mostrar datos
        res.send( tiposDocs );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET TiposDocs");
    }
}

// Agregar un TipoDoc nuevo
const createTipoDoc = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        // Verificar la existencia del TipoDoc
        const checkIsExist = await TipoDoc.findOne({ where : {nombre: body.nombre} });
        if (checkIsExist) {
            handleErrorResponse(res, "TIPO_EXISTS", 401);
            return;
        }

        // Crear TipoDoc de DB
        const tipoDoc = await TipoDoc.create(body);
        const data = {
            ok: true,
            msg: 'Tipo creado exitosamente',
            tipoDoc
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE TipoDoc")
    }
}

// Editar TipoDoc seleccionado
const updateTipoDoc = async(req, res = response) => {

    try {
        // Editar TipoDoc seleccionado
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        const tipoDoc = await TipoDoc.findByPk( id );
        // Checkear si el TipoDoc existe
        if(!tipoDoc) {
            handleErrorResponse(res, "TIPO_NOT_EXISTS", 404);
            return;
        }
        // verificar si el nombre ya existe en la DB
        if(!body.nombre === tipoDoc.nombre){
            const checkIsExist = await TipoDoc.findOne({ where : {nombre: body.nombre} });
            if (checkIsExist) {
                handleErrorResponse(res, "TIPO_EXISTS", 401);
                return;
            }
        }

        await tipoDoc.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'TipoDoc creada exitosamente',
            tipoDoc
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE TipoDoc")
    }
}

// Eliminar TipoDoc
const deleteTipoDoc = async(req, res = response) => {

    try {
        // Eliminar TipoDoc seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const tipoDoc = await TipoDoc.findByPk( id );
        if(!tipoDoc) {
            handleErrorResponse(res, "TIPO_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el TipoDoc este inactivo

        // Eliminando datos
        await tipoDoc.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'TipoDoc eliminado exitosamente',
            tipoDoc
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE TipoDoc")
    }
}

module.exports = {
    getTipoDoc,
    getTiposDocs,
    createTipoDoc,
    updateTipoDoc,
    deleteTipoDoc
}