const { response } = require('express');
const RequisitoExpediente = require('../models/requisitos_expediente');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');



// Ver RequisitoExpediente
const getRequisitoExpediente = async(req, res = response) => {

    try {
        // Ver RequisitoExpediente seleccionado
        const { id } = req.params;
        const requisitoExpediente = await RequisitoExpediente.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !requisitoExpediente ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ requisitoExpediente });
    } catch (error) {
        handleHttpError(res, "ERROR GET RequisitoExpediente");
    }
}

// Ver RequisitoExpedientes
const getRequisitosExpediente = async(req, res = response) => {

    try {
        // Obtener datos
        const requisitosExpediente = await RequisitoExpediente.findAll();
        // Mostrar datos
        res.send( requisitosExpediente );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET RequisitoExpedientes");
    }
}

// Agregar un RequisitoExpediente nuevo
const createRequisitoExpediente = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { estado, fecha_vencimiento, id_requisito, id_expediente } = req.body;
        const body = { estado, fecha_vencimiento, id_requisito, id_expediente };

        // Crear RequisitoExpediente de DB
        ;
        const requisitoExpediente = await RequisitoExpediente.create(body);
        const data = {
            ok: true,
            msg: 'RequisitoExpediente creado exitosamente',
            requisitoExpediente
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE RequisitoExpediente")
    }
}

// Editar RequisitoExpediente seleccionado
const updateRequisitoExpediente = async(req, res = response) => {

    try {
        // Editar RequisitoExpediente seleccionado
        const { id } = req.params;
        const { estado, fecha_vencimiento, id_requisito, id_expediente } = req.body;
        const body = { estado, fecha_vencimiento, id_requisito, id_expediente };
        const requisitoExpediente = await RequisitoExpediente.findByPk( id );
        // Checkear si el RequisitoExpediente existe
        if(!requisitoExpediente) {
            handleErrorResponse(res, "REFERENCIA_NOT_EXISTS", 404);
            return;
        }
        await requisitoExpediente.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'RequisitoExpediente actualizado exitosamente',
            requisitoExpediente
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE RequisitoExpediente")
    }
}

// Eliminar RequisitoExpediente
const deleteRequisitoExpediente = async(req, res = response) => {

    try {
        // Eliminar RequisitoExpediente seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const requisitoExpediente = await RequisitoExpediente.findByPk( id );
        if(!requisitoExpediente) {
            handleErrorResponse(res, "REFERENCIA_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el RequisitoExpediente este inactivo

        // Eliminando datos
        await requisitoExpediente.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'RequisitoExpediente eliminado exitosamente',
            requisitoExpediente
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE RequisitoExpediente")
    }
}

module.exports = {
    getRequisitoExpediente,
    getRequisitosExpediente,
    createRequisitoExpediente,
    updateRequisitoExpediente,
    deleteRequisitoExpediente
}