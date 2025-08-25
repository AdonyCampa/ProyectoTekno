const { response } = require('express');
const Departamento = require('../models/departamentos');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver Departamento
const getDepartamento = async(req, res = response) => {

    try {
        // Ver Departamento seleccionado
        const { id } = req.params;
        const departamento = await Departamento.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !departamento ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ departamento });
    } catch (error) {
        handleHttpError(res, "ERROR GET Departamento");
    }
}

// Ver Departamentos
const getDepartamentos = async(req, res = response) => {

    try {
        // Obtener datos
        const departamentos = await Departamento.findAll();
        // Mostrar datos
        res.send( departamentos );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Departamentos");
    }
}

// Agregar un Departamento nuevo
const createDepartamento = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        // Verificar la existencia del Departamento
        const checkIsExist = await Departamento.findOne({ where : {nombre: body.nombre} });
        if (checkIsExist) {
            handleErrorResponse(res, "DEPARTAMENTO_EXISTS", 401);
            return;
        }

        // Crear Departamento de DB
        const departamento = await Departamento.create(body);
        const data = {
            ok: true,
            msg: 'Departamento creado exitosamente',
            departamento
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE Departamento")
    }
}

// Editar Departamento seleccionado
const updateDepartamento = async(req, res = response) => {

    try {
        // Editar Departamento seleccionado
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion };
        const departamento = await Departamento.findByPk( id );
        // Checkear si el Departamento existe
        if(!departamento) {
            handleErrorResponse(res, "PLAZA_NOT_EXISTS", 404);
            return;
        }
        // verificar si el nombre ya existe en la DB
        if(!body.nombre === departamento.nombre){
            const checkIsExist = await Departamento.findOne({ where : {nombre: body.nombre} });
            if (checkIsExist) {
                handleErrorResponse(res, "DEPARTAMENTO_EXISTS", 401);
                return;
            } 
        }
        await departamento.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Departamento creada exitosamente',
            departamento
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE Departamento")
    }
}

// Eliminar Departamento
const deleteDepartamento = async(req, res = response) => {

    try {
        // Eliminar Departamento seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const departamento = await Departamento.findByPk( id );
        if(!departamento) {
            handleErrorResponse(res, "DEPARTAMENTO_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el Departamento este inactivo

        // Eliminando datos
        await departamento.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Departamento eliminado exitosamente',
            departamento
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE Departamento")
    }
}

module.exports = {
    getDepartamento,
    getDepartamentos,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento
}