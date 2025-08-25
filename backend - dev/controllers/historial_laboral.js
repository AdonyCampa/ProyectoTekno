const { response } = require('express');
const HistorialLaboral = require('../models/historial_laboral');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');



// Ver historialLaboral
const getHistorialLaboral = async(req, res = response) => {

    try {
        // Ver historialLaboral seleccionado
        const { id } = req.params;
        const historialLaboral = await HistorialLaboral.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !historialLaboral ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ historialLaboral });
    } catch (error) {
        handleHttpError(res, "ERROR GET historialLaboral");
    }
}

// Ver historialLaborals
const getHistorialesLaborales = async(req, res = response) => {

    try {
        // Obtener datos
        const historialLaborales = await HistorialLaboral.findAll();
        // Mostrar datos
        res.send( historialLaborales );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET historialLaborals");
    }
}

// Agregar un historialLaboral nuevo
const createHistorialLaboral = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { empresa, direccion, telefono, puesto, fecha_inicio, fecha_fin, id_expediente } = req.body;
        const body = { empresa, direccion, telefono, puesto, fecha_inicio, fecha_fin, id_expediente };

        // Crear historialLaboral de DB
        ;
        const historialLaboral = await HistorialLaboral.create(body);
        const data = {
            ok: true,
            msg: 'historialLaboral creado exitosamente',
            historialLaboral
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE historialLaboral")
    }
}

// Editar historialLaboral seleccionado
const updateHistorialLaboral = async(req, res = response) => {

    try {
        // Editar historialLaboral seleccionado
        const { id } = req.params;
        const { empresa, direccion, telefono, puesto, fecha_inicio, fecha_fin, id_expediente } = req.body;
        const body = { empresa, direccion, telefono, puesto, fecha_inicio, fecha_fin, id_expediente };
        const historialLaboral = await HistorialLaboral.findByPk( id );
        // Checkear si el historialLaboral existe
        if(!historialLaboral) {
            handleErrorResponse(res, "HISTORIAL_NOT_EXISTS", 404);
            return;
        }
        await historialLaboral.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'historialLaboral actualizado exitosamente',
            historialLaboral
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE historialLaboral")
    }
}

// Eliminar historialLaboral
const deleteHistorialLaboral = async(req, res = response) => {

    try {
        // Eliminar historialLaboral seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const historialLaboral = await HistorialLaboral.findByPk( id );
        if(!historialLaboral) {
            handleErrorResponse(res, "HISTORIAL_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el historialLaboral este inactivo

        // Eliminando datos
        await historialLaboral.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'historialLaboral eliminado exitosamente',
            historialLaboral
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE historialLaboral")
    }
}

module.exports = {
    getHistorialLaboral,
    getHistorialesLaborales,
    createHistorialLaboral,
    updateHistorialLaboral,
    deleteHistorialLaboral
}