const { response } = require('express');
const ReferenciaPersonal = require('../models/referencias_personales');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');



// Ver ReferenciaPersonal
const getReferenciaPersonal = async(req, res = response) => {

    try {
        // Ver ReferenciaPersonal seleccionado
        const { id } = req.params;
        const referenciaPersonal = await ReferenciaPersonal.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !referenciaPersonal ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ referenciaPersonal });
    } catch (error) {
        handleHttpError(res, "ERROR GET ReferenciaPersonal");
    }
}

// Ver ReferenciaPersonals
const getReferenciasPersonales = async(req, res = response) => {

    try {
        // Obtener datos
        const referenciasPersonales = await ReferenciaPersonal.findAll();
        // Mostrar datos
        res.send( referenciasPersonales );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET ReferenciaPersonals");
    }
}

// Agregar un ReferenciaPersonal nuevo
const createReferenciaPersonal = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { nombres, ocupacion, telefono, id_expediente } = req.body;
        const body = { nombres, ocupacion, telefono, id_expediente };

        // Crear ReferenciaPersonal de DB
        ;
        const referenciaPersonal = await ReferenciaPersonal.create(body);
        const data = {
            ok: true,
            msg: 'ReferenciaPersonal creado exitosamente',
            referenciaPersonal
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE ReferenciaPersonal")
    }
}

// Editar ReferenciaPersonal seleccionado
const updateReferenciaPersonal = async(req, res = response) => {

    try {
        // Editar ReferenciaPersonal seleccionado
        const { id } = req.params;
        const { referencias} = req.body;

        console.log(referencias);


        const updateReferencias = await Promise.all(referencias.map(async referencia =>{
            const {id, nombres, ocupacion, telefono, id_expediente, action } = referencia;
            const body = {nombres, ocupacion, telefono, id_expediente }

            if(id){

                const findReferenicia = await ReferenciaPersonal.findByPk(id);
                if (!findReferenicia){
                handleErrorResponse(res, "REFERENCIA_NOT_EXISTS", 404);
                return;
                }
                // Detectar accion
    
                if (action === 'update'){
                    console.log(action);
                    await findReferenicia.update(body);
                    return action;
                }
                if (action === 'delete'){
                    console.log(action);
                    await findReferenicia.destroy();
                    return action;
                }
            }else {
                if (action == 'create'){
                    console.log(action);
                    await ReferenciaPersonal.create(body);
                    return action;
                }
            }

        } ))





        // const referenciaPersonal = await ReferenciaPersonal.findByPk( id );
        // // Checkear si el ReferenciaPersonal existe
        // if(!referenciaPersonal) {
        //     handleErrorResponse(res, "REFERENCIA_NOT_EXISTS", 404);
        //     return;
        // }
        // await referenciaPersonal.update(body);
        // // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'ReferenciaPersonal actualizado exitosamente',
            updateReferencias
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE ReferenciaPersonal")
    }
}

// Eliminar ReferenciaPersonal
const deleteReferenciaPersonal = async(req, res = response) => {

    try {
        // Eliminar ReferenciaPersonal seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const referenciaPersonal = await ReferenciaPersonal.findByPk( id );
        if(!referenciaPersonal) {
            handleErrorResponse(res, "REFERENCIA_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el ReferenciaPersonal este inactivo

        // Eliminando datos
        await referenciaPersonal.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'ReferenciaPersonal eliminado exitosamente',
            referenciaPersonal
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE ReferenciaPersonal")
    }
}

module.exports = {
    getReferenciaPersonal,
    getReferenciasPersonales,
    createReferenciaPersonal,
    updateReferenciaPersonal,
    deleteReferenciaPersonal
}