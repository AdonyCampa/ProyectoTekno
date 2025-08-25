const { response } = require('express');
const { Contrato, ContratosView } = require('../models/contratos');
const { Plaza } = require('../models/plazas')
const { Expediente } = require('../models/expedientes')
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver Contrato
const getContrato = async(req, res = response) => {

    try {
        // Ver Contrato seleccionado
        const { id } = req.params;
        const contrato = await Contrato.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !contrato ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ contrato });
    } catch (error) {
        handleHttpError(res, "ERROR GET Contrato");
    }
}

// Ver Contratos
const getContratos = async(req, res = response) => {

    try {
        // Obtener datos
        const contratos = await ContratosView.findAll({ where : {estado: 'creado'} });
        // Mostrar datos
        res.send( contratos );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Contratos");
    }
}

// Agregar un Contrato nuevo
const createContrato = async(req, res = response) => {

    try {
        // Limpiar los datos
        const body = matchedData(req);
        // Verificar la existencia del Contrato

        const checkIsExistContrato = await Contrato.findOne({ where : {no_contrato: body.no_contrato} });
        if (checkIsExistContrato) {
            handleErrorResponse(res, "NO_CONTRATO_EXISTS", 401);
            return;
        }
        const checkIsExistAcuerdo = await Contrato.findOne({ where : {no_acuerdo: body.no_acuerdo} });
        if (checkIsExistAcuerdo) {
            handleErrorResponse(res, "NO_ACUERDO_EXISTS", 401);
            return;
        }
        // Verificar si id plaza existe
        const checkExistPlaza = await Plaza.findOne({ where : {id: body.id_plaza} });
        if (!checkExistPlaza) {
            handleErrorResponse(res, "PLAZA_NOT_EXISTS", 401);
            return;
        }

        // Verificar si id expediente existe
        const checkExistExpediente = await Expediente.findOne({ where : {id: body.id_expediente} });
        if (!checkExistExpediente) {
            handleErrorResponse(res, "EXPEDIENTE_NOT_EXISTS", 401);
            return;
        }

        // Crear Contrato de DB
        const contrato = await Contrato.create(body);
        const data = {
            ok: true,
            msg: 'Contrato creado exitosamente',
            contrato
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE Contrato")
    }
}

// Editar Contrato seleccionado
const updateContrato = async(req, res = response) => {

    try {
        // Editar Contrato seleccionado
        const { id } = req.params;
        const body = matchedData(req);

        const contrato = await Contrato.findByPk( id );
        // Checkear si el Contrato existe
        if(!contrato) {
            handleErrorResponse(res, "CONTRATO_NOT_EXISTS", 404);
            return;
        }

        // Verificar si id plaza existe
        const checkExistPlaza = await Plaza.findOne({ where : {id: body.id_plaza} });
        if (!checkExistPlaza) {
            handleErrorResponse(res, "PLAZA_NOT_EXISTS", 401);
            return;
        }

        // Verificar si id expediente existe
        const checkExistExpediente = await Expediente.findOne({ where : {id: body.id_expediente} });
        if (!checkExistExpediente) {
            handleErrorResponse(res, "EXPEDIENTE_NOT_EXISTS", 401);
            return;
        }
        // verificar si el nombre ya existe en la DB
        await contrato.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Contrato actualizado exitosamente',
            contrato
        }
        res.send(data);
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR UPDATE Contrato")
    }
}

// Eliminar Contrato
const deleteContrato = async(req, res = response) => {

    try {
        // Eliminar Contrato seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const contrato = await Contrato.findByPk( id );
        if(!contrato) {
            handleErrorResponse(res, "Contrato_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Contrato este inactivo

        // Eliminando datos
        await contrato.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Contrato eliminado exitosamente',
            contrato
        }
        res.send(data);

    } catch (error) {
        console.log(error);
        handleHttpError(res, error)
    }
}

module.exports = {
    getContrato,
    getContratos,
    createContrato,
    updateContrato,
    deleteContrato
}