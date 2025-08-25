const { response } = require('express');
const CatPlaza = require('../models/catPlazas');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');


// Ver CatPlaza
const getCatPlaza = async(req, res = response) => {

    try {
        // Ver CatPlaza seleccionado
        const { id } = req.params;
        const catPlaza = await CatPlaza.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !catPlaza ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ catPlaza });
    } catch (error) {
        handleHttpError(res, "ERROR GET CatPlaza");
    }
}

// Ver CatPlazas
const getCatPlazas = async(req, res = response) => {

    try {
        // Obtener datos
        const catPlazas = await CatPlaza.findAll();
        // Mostrar datos
        res.send( catPlazas );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET CatPlazas");
    }
}

// Agregar un CatPlaza nuevo
const createCatPlaza = async(req, res = response) => {

    try {
        // Limpiar los datos
        const {nombre, descripcion} = req.body;
        const body = { nombre, descripcion }
        // Verificar la existencia del CatPlaza
        const checkIsExist = await CatPlaza.findOne({ where : {nombre: body.nombre} });
        if (checkIsExist) {
            handleErrorResponse(res, "NAME_EXISTS", 401);
            return;
        }

        // Crear CatPlaza de DB
        const catPlaza = await CatPlaza.create(body);
        const data = {
            ok: true,
            msg: 'CatPlaza creado exitosamente',
            catPlaza
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE CatPlaza")
    }
}

// Editar CatPlaza seleccionado
const updateCatPlaza = async(req, res = response) => {

    try {
        // Editar CatPlaza seleccionado
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const body = { nombre, descripcion }
        const catPlaza = await CatPlaza.findByPk( id );


        // Checkear si el CatPlaza existe
        if(!catPlaza) {
            handleErrorResponse(res, "PLAZA_NOT_EXISTS", 404);
            return;
        }
        // verificar si el nombre ya existe en la DB
        if(!body.nombre === catPlaza.nombre){
            const checkIsExist = await CatPlaza.findOne({ where : {nombre: body.nombre} });
            if (checkIsExist) {
                handleErrorResponse(res, "NAME_EXISTS", 401);
                return;
            }
        }


        await catPlaza.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'CatPlaza actualizada exitosamente',
            catPlaza
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE CatPlaza")
    }
}

// Eliminar CatPlaza
const deleteCatPlaza = async(req, res = response) => {

    try {
        // Eliminar CatPlaza seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const catPlaza = await CatPlaza.findByPk( id );
        if(!catPlaza) {
            handleErrorResponse(res, "PLAZA_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el CatPlaza este inactivo

        // Eliminando datos
        await catPlaza.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'CatPlaza eliminado exitosamente',
            CatPlaza
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE CatPlaza")
    }
}

module.exports = {
    getCatPlaza,
    getCatPlazas,
    createCatPlaza,
    updateCatPlaza,
    deleteCatPlaza
}