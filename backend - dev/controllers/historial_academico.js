const { response } = require('express');
const HistorialAcademico = require('../models/historial_academico');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');



// Ver historialacademico
const getHistorialAcademico = async(req, res = response) => {

    try {
        // Ver historialacademico seleccionado
        const { id } = req.params;
        const historialAcademico = await HistorialAcademico.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !historialAcademico ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ historialAcademico });
    } catch (error) {
        handleHttpError(res, "ERROR GET historialacademico");
    }
}

// Ver historialacademicos
const getHistorialesAcademicos = async(req, res = response) => {

    try {
        // Obtener datos
        const historialAcademicos = await HistorialAcademico.findAll();
        // Mostrar datos
        res.send( historialAcademicos );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET historialacademicos");
    }
}

// Agregar un historialacademico nuevo
const createHistorialAcademico = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { id_nivel, establecimiento, titulo, fecha, id_expediente } = req.body;
        const body = { id_nivel, establecimiento, titulo, fecha, id_expediente };

        // Crear historialacademico de DB
        ;
        const historialAcademico = await HistorialAcademico.create(body);
        const data = {
            ok: true,
            msg: 'historialacademico creado exitosamente',
            historialAcademico
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE historialacademico")
    }
}

// Editar historialacademico seleccionado
const updateHistorialAcademico = async(req, res = response) => {

    try {
        // Editar historialacademico seleccionado
        const { id } = req.params;
        const { id_nivel, establecimiento, titulo, fecha, id_expediente } = req.body;
        const body = { id_nivel, establecimiento, titulo, fecha, id_expediente };
        const historialAcademico = await HistorialAcademico.findByPk( id );
        // Checkear si el historialacademico existe
        if(!historialAcademico) {
            handleErrorResponse(res, "HISTORIAL_NOT_EXISTS", 404);
            return;
        }
        await historialAcademico.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'historialacademico actualizado exitosamente',
            historialAcademico
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE historialacademico")
    }
}

// Eliminar historialacademico
const deleteHistorialAcademico = async(req, res = response) => {

    try {
        // Eliminar historialacademico seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const historialAcademico = await HistorialAcademico.findByPk( id );
        if(!historialAcademico) {
            handleErrorResponse(res, "HISTORIAL_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el historialacademico este inactivo

        // Eliminando datos
        await historialAcademico.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'historialacademico eliminado exitosamente',
            historialAcademico
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE historialacademico")
    }
}

module.exports = {
    getHistorialAcademico,
    getHistorialesAcademicos,
    createHistorialAcademico,
    updateHistorialAcademico,
    deleteHistorialAcademico
}