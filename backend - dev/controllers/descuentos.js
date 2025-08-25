const { response } = require('express');
const Descuento = require('../models/descuentos');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver Descuento
const getDescuento = async(req, res = response) => {

    try {
        // Ver Descuento seleccionado
        const { id } = req.params;
        const descuento = await Descuento.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !descuento ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ descuento });
    } catch (error) {
        handleHttpError(res, "ERROR GET Descuento");
    }
}

// Ver Descuentos
const getDescuentos = async(req, res = response) => {

    try {
        // Obtener datos
        const descuentos = await Descuento.findAll();
        // Mostrar datos
        res.send( descuentos );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Descuentos");
    }
}

// Agregar un Descuento nuevo
const createDescuento = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { nombre, descuento, descripcion} = req.body;
        const body = { nombre, descuento, descripcion};
        // Verificar la existencia del Descuento
        const checkIsExist = await Descuento.findOne({ where : {nombre: body.nombre} });
        if (checkIsExist) {
            handleErrorResponse(res, "DESCUENTO_EXISTS", 401);
            return;
        }

        // Crear Descuento de DB
        const dataInsert = await Descuento.create(body);
        const data = {
            ok: true,
            msg: 'Descuento creado exitosamente',
            dataInsert
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE Descuento")
    }
}

// Editar Descuento seleccionado
const updateDescuento = async(req, res = response) => {

    try {
        // Editar Descuento seleccionado
        const { id } = req.params;
        const { nombre, descuento, descripcion} = req.body;
        const body = { nombre, descuento, descripcion};

        const dataId = await Descuento.findByPk( id );
        // Checkear si el Descuento existe
        if(!dataId) {
            handleErrorResponse(res, "DESCUENTO_NOT_EXISTS", 404);
            return;
        }
        // verificar si el nombre ya existe en la DB
        if(!body.nombre === dataId.nombre){
            const checkIsExist = await Descuento.findOne({ where : {nombre: body.nombre} });
            if (checkIsExist) {
                handleErrorResponse(res, "DESCUENTO_EXISTS", 401);
                return;
            }
        }
        await dataId.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Descuento actualizado exitosamente',
            dataId
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE Descuento")
    }
}

// Eliminar Descuento
const deleteDescuento = async(req, res = response) => {

    try {
        // Eliminar Descuento seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const descuento = await Descuento.findByPk( id );
        if(!descuento) {
            handleErrorResponse(res, "DESCUENTO_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Descuento este inactivo

        // Eliminando datos
        await descuento.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Descuento eliminado exitosamente',
            descuento
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE Descuento")
    }
}

module.exports = {
    getDescuento,
    getDescuentos,
    createDescuento,
    updateDescuento,
    deleteDescuento
}