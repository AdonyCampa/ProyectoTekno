const { response } = require('express');
const Tardanza = require('../models/tardanzas');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');
const { Contrato } = require('../models/contratos');
const { ExpedienteControl } = require('../models/expedientes');


// Ver Tardanza
const getTardanza = async(req, res = response) => {

    try {
        // Ver Tardanza seleccionado
        const { id } = req.params;
        const tardanza = await Tardanza.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !tardanza ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ tardanza });
    } catch (error) {
        handleHttpError(res, "ERROR GET Tardanza");
    }
}

// Ver Tardanzas
const getTardanzas = async(req, res = response) => {

    try {
        // Obtener datos
        const datos = await ExpedienteControl.findAll();

        const tardanzas = await Promise.all(datos.map( async personal =>{
            const {id, nombres, apellidos, plaza, departamento } = personal;
            const tardanzas = await Tardanza.findAll({ where : {id_empleado: id}});
            if( tardanzas.length ){
                return { id, nombres, apellidos, plaza, departamento, tardanzas };
            }
        }));

        const cleanData = tardanzas.filter(Boolean);
        // Mostrar datos
        res.send( cleanData );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Tardanzas");
    }
}

// Agregar un Tardanza nuevo
const createTardanza = async(req, res = response) => {

    try {
        // Limpiar los datos
        const body = matchedData(req);

        // Verificar si id empleado existe
        const checkExistContrato = await Contrato.findOne({ where : {id: body.id_empleado} });
        if (!checkExistContrato) {
            handleErrorResponse(res, "EMPLEADO_NOT_EXISTS", 401);
            return;
        }

        // Crear Tardanza de DB
        const tardanza = await Tardanza.create(body);
        const data = {
            ok: true,
            msg: 'Tardanza creado exitosamente',
            tardanza
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE Tardanza")
    }
}

// Editar Tardanza seleccionado
const updateTardanza = async(req, res = response) => {

    try {
        // Editar Tardanza seleccionado
        const { id } = req.params;
        const body = matchedData(req);

        const tardanza = await Tardanza.findByPk( id );
        // Checkear si el Tardanza existe
        if(!tardanza) {
            handleErrorResponse(res, "Tardanza_NOT_EXISTS", 404);
            return;
        }

        // Verificar si id empleado existe
        const checkExistContrato = await Contrato.findOne({ where : {id: body.id_empleado} });
        if (!checkExistContrato) {
            handleErrorResponse(res, "EMPLEADO_NOT_EXISTS", 401);
            return;
        }

        // verificar si el nombre ya existe en la DB
        await tardanza.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Tardanza actualizado exitosamente',
            tardanza
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE Tardanza")
    }
}

// Eliminar Tardanza
const deleteTardanza = async(req, res = response) => {

    try {
        // Eliminar Tardanza seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const tardanza = await Tardanza.findByPk( id );
        if(!tardanza) {
            handleErrorResponse(res, "Tardanza_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Tardanza este inactivo

        // Eliminando datos
        await tardanza.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Tardanza eliminado exitosamente',
            tardanza
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE Tardanza")
    }
}

module.exports = {
    getTardanza,
    getTardanzas,
    createTardanza,
    updateTardanza,
    deleteTardanza
}