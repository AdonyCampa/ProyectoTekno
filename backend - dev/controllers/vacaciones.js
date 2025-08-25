const { response } = require('express');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');
const { Contrato } = require('../models/contratos');
const ProgramacionV = require('../models/vacaciones');
const { ExpedienteControl } = require('../models/expedientes');


// Ver Vacaciones
const getProgramacion = async(req, res = response) => {

    try {
        // Ver Vacaciones seleccionado
        const { id } = req.params;
        const programacion = await ProgramacionV.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !programacion ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ programacion });
    } catch (error) {
        handleHttpError(res, "ERROR GET Vacaciones");
    }
}

// Ver Vacacioness
const getProgramaciones = async(req, res = response) => {

    try {

        // Obtener datos
        const datos = await ExpedienteControl.findAll();

        const programaciones = await Promise.all(datos.map( async personal =>{
            const {id, nombres, apellidos, plaza, departamento } = personal;
            const programaciones = await ProgramacionV.findAll({ where : {id_empleado: id}});
            if( programaciones.length ){
                return { id, nombres, apellidos, plaza, departamento, programaciones };
            }
        }));

        const cleanData = programaciones.filter(Boolean);
        // Mostrar datos
        res.send( cleanData );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Vacacioness");
    }
}

// Agregar un Vacaciones nuevo
const createProgramacion = async(req, res = response) => {

    try {
        // Limpiar los datos
        const body = matchedData(req);

        // Verificar si id empleado existe
        const checkExistContrato = await Contrato.findOne({ where : {id: body.id_empleado} });
        if (!checkExistContrato) {
            handleErrorResponse(res, "EMPLEADO_NOT_EXISTS", 401);
            return;
        }

        // Crear Vacaciones de DB
        const programacion = await ProgramacionV.create(body);
        const data = {
            ok: true,
            msg: 'Vacaciones creado exitosamente',
            programacion
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE Vacaciones")
    }
}

// Editar Vacaciones seleccionado
const updateProgramacion = async(req, res = response) => {

    try {
        // Editar Vacaciones seleccionado
        const { id } = req.params;
        const body = matchedData(req);

        const programacion = await ProgramacionV.findByPk( id );
        // Checkear si el Vacaciones existe
        if(!programacion) {
            handleErrorResponse(res, "Vacaciones_NOT_EXISTS", 404);
            return;
        }

        // Verificar si id empleado existe
        const checkExistContrato = await Contrato.findOne({ where : {id: body.id_empleado} });
        if (!checkExistContrato) {
            handleErrorResponse(res, "EMPLEADO_NOT_EXISTS", 401);
            return;
        }

        // verificar si el nombre ya existe en la DB
        await programacion.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Vacaciones actualizado exitosamente',
            programacion
        }
        res.send(data);
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR UPDATE Vacaciones")
    }
}

// Eliminar Vacaciones
const deleteProgramacion = async(req, res = response) => {

    try {
        // Eliminar Vacaciones seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const programacion = await ProgramacionV.findByPk( id );
        if(!programacion) {
            handleErrorResponse(res, "Vacaciones_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Vacaciones este inactivo

        // Eliminando datos
        await programacion.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Vacaciones eliminado exitosamente',
            programacion
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE Vacaciones")
    }
}

module.exports = {
    getProgramacion,
    getProgramaciones,
    createProgramacion,
    updateProgramacion,
    deleteProgramacion
}