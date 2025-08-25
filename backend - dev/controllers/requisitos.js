const { response } = require('express');
const Requisito = require('../models/requisitos');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData, check } = require('express-validator');


// Ver Requisito
const getRequisito = async(req, res = response) => {

    try {
        // Ver Requisito seleccionado
        const { id } = req.params;
        const requisito = await Requisito.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !requisito ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ requisito });
    } catch (error) {
        handleHttpError(res, "ERROR GET Requisito");
    }
}

// Ver Requisitos
const getRequisitos = async(req, res = response) => {

    try {
        // Obtener datos
        const requisitos = await Requisito.findAll();
        // Mostrar datos
        res.send( requisitos );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Requisitos");
    }
}

// Agregar un Requisito nuevo
const createRequisito = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        // Verificar la existencia del Requisito
        const checkIsExist = await Requisito.findOne({ where : {nombre: body.nombre} });
        if (checkIsExist) {
            handleErrorResponse(res, "REQUISITO_EXISTS", 401);
            return;
        }
        // Crear Requisito de DB
        const requisito = await Requisito.create(body);
        const data = {
            ok: true,
            msg: 'Requisito creado exitosamente',
            requisito
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE Requisito")
    }
}

// Editar Requisito seleccionado
const updateRequisito = async(req, res = response) => {

    try {
        // Editar Requisito seleccionado
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        const requisito = await Requisito.findByPk( id );
        // Checkear si el Requisito existe
        if(!requisito) {
            handleErrorResponse(res, "REQUISITO_NOT_EXISTS", 404);
            return;
        }
        // verificar si el nombre ya existe en la DB
        if(!body.nombre === requisito.nombre){
            const checkIsExist = await Requisito.findOne({ where : {nombre: body.nombre} });
            if (checkIsExist) {
                handleErrorResponse(res, "REQUISITO_EXISTS", 401);
                return;
            }
        }

        await requisito.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Requisito creada exitosamente',
            requisito
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE Requisito")
    }
}

// Eliminar Requisito
const deleteRequisito = async(req, res = response) => {

    try {
        // Eliminar Requisito seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const requisito = await Requisito.findByPk( id );

        if(!requisito) {
            handleErrorResponse(res, "REQUISITO_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Requisito este inactivo

        // Eliminando datos
        await requisito.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Requisito eliminado exitosamente',
            requisito
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE Requisito")
    }
}

module.exports = {
    getRequisito,
    getRequisitos,
    createRequisito,
    updateRequisito,
    deleteRequisito
}