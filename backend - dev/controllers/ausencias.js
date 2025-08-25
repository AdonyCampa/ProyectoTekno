const { response } = require('express');
const Ausencia = require('../models/ausencias');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');
const { Contrato } = require('../models/contratos');
const { ExpedienteControl } = require('../models/expedientes');


// Ver Ausencia
const getAusencia = async(req, res = response) => {

    try {
        // Ver Ausencia seleccionado
        const { id } = req.params;
        const ausencia = await Ausencia.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !ausencia ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ ausencia });
    } catch (error) {
        handleHttpError(res, "ERROR GET Ausencia");
    }
}

// Ver Ausencias
const getAusencias = async(req, res = response) => {

    try {
        // Obtener datos
        const datos = await ExpedienteControl.findAll();

        const ausencias = await Promise.all(datos.map( async personal =>{
            const {id, nombres, apellidos, plaza, departamento } = personal;
            const ausencias = await Ausencia.findAll({ where : {id_empleado: id}});
            if( ausencias.length ){
                return { id, nombres, apellidos, plaza, departamento, ausencias };
            }
        }));

        const cleanData = ausencias.filter(Boolean);
        // Mostrar datos
        res.send( cleanData );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Ausencias");
    }
}

// Agregar un Ausencia nuevo
const createAusencia = async(req, res = response) => {

    try {
        // Limpiar los datos
        const body = matchedData(req);

        // Verificar si id empleado existe
        const checkExistContrato = await Contrato.findOne({ where : {id: body.id_empleado} });
        if (!checkExistContrato) {
            handleErrorResponse(res, "EMPLEADO_NOT_EXISTS", 401);
            return;
        }

        // Crear Ausencia de DB
        const ausencia = await Ausencia.create(body);
        const data = {
            ok: true,
            msg: 'Ausencia creado exitosamente',
            ausencia
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE Ausencia")
    }
}

// Editar Ausencia seleccionado
const updateAusencia = async(req, res = response) => {

    try {
        // Editar Ausencia seleccionado
        const { id } = req.params;
        const body = matchedData(req);

        const ausencia = await Ausencia.findByPk( id );
        // Checkear si el Ausencia existe
        if(!ausencia) {
            handleErrorResponse(res, "Ausencia_NOT_EXISTS", 404);
            return;
        }

        // Verificar si id empleado existe
        const checkExistContrato = await Contrato.findOne({ where : {id: body.id_empleado} });
        if (!checkExistContrato) {
            handleErrorResponse(res, "EMPLEADO_NOT_EXISTS", 401);
            return;
        }

        // verificar si el nombre ya existe en la DB
        await ausencia.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Ausencia actualizado exitosamente',
            ausencia
        }
        res.send(data);
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR UPDATE Ausencia")
    }
}

// Eliminar Ausencia
const deleteAusencia = async(req, res = response) => {

    try {
        // Eliminar Ausencia seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const ausencia = await Ausencia.findByPk( id );
        if(!ausencia) {
            handleErrorResponse(res, "Ausencia_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Ausencia este inactivo

        // Eliminando datos
        await ausencia.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Ausencia eliminado exitosamente',
            ausencia
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE Ausencia")
    }
}

module.exports = {
    getAusencia,
    getAusencias,
    createAusencia,
    updateAusencia,
    deleteAusencia
}