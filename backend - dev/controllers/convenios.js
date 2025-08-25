const { response } = require('express');
const Convenio = require('../models/convenios');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');



// Ver convenio
const getConvenio = async(req, res = response) => {

    try {
        // Ver convenio seleccionado
        const { id } = req.params;
        const convenio = await Convenio.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !convenio ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ convenio });
    } catch (error) {
        handleHttpError(res, "ERROR GET convenio");
    }
}

// Ver convenios
const getConvenios = async(req, res = response) => {

    try {
        // Obtener datos
        console.log("convenios");
        const convenios = await Convenio.findAll();
        // Mostrar datos
        res.send( convenios );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        console.log(error);
        handleHttpError(res, "ERROR GET convenios");
    }
}

// Agregar un convenio nuevo
const createConvenio = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { motivo, total_pago, cant_pagos, fecha, finiquito, fecha_finiquito, descripcion } = req.body;
        const body = { motivo, total_pago, cant_pagos, fecha, finiquito, fecha_finiquito, descripcion  };
        console.log(body);
        // Crear convenio de DB
        const convenio = await Convenio.create(body);
        const data = {
            ok: true,
            msg: 'Convenio creado exitosamente',
            convenio
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE convenio")
    }
}

// Editar convenio seleccionado
const updateConvenio = async(req, res = response) => {

    try {
        // Editar convenio seleccionado
        const { id } = req.params;
        const { motivo, total_pago, cant_pagos, fecha, finiquito, fecha_finiquito, descripcion } = req.body;
        const body = { motivo, total_pago, cant_pagos, fecha, finiquito, fecha_finiquito, descripcion  };
        const convenio = await Convenio.findByPk( id );
        // Checkear si el convenio existe
        if(!convenio) {
            handleErrorResponse(res, "CONVENIO_NOT_EXISTS", 404);
            return;
        }
        
        await convenio.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Convenio actualizado exitosamente',
            convenio
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE convenio")
    }
}

// Eliminar convenio
const deleteConvenio = async(req, res = response) => {

    try {
        // Eliminar convenio seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const convenio = await Convenio.findByPk( id );
        if(!convenio) {
            handleErrorResponse(res, "convenio_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el convenio este inactivo

        // Eliminando datos
        await convenio.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Convenio eliminado exitosamente',
            convenio
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE convenio")
    }
}

module.exports = {
    getConvenio,
    getConvenios,
    createConvenio,
    updateConvenio,
    deleteConvenio
}