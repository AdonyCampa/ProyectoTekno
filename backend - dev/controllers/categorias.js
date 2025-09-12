const { response } = require('express');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');
const Categorias = require('../models/categorias');


// Ver Categoria
const getCat = async (req, res = response) => {
    try {
        // Obtener datos desde el frontend
        const { id } = req.params;
        const cat = await Categorias.findByPk(id);

        // Comprobar si existe el id ingresado
        if (!cat) {
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID Categoria no existe", 404);
            return;
        }
        // Generar respuesta exitosa
        res.send(cat);
    } catch (error) {
        handleHttpError(res, "Error al buscar categoria");

    }
}
// Ver Categorias
const getCats = async (req, res = response) => {
    try {
        // Obtener datos
        const cat = await Categorias.findAll();

        // Mostrar datos
        res.send(cat);

    } catch (error) {

        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "Error al obtener categorias");

    }
}

// Agregar un Categorias nueva
const createCat = async (req, res = response) => {
    try {
        // Limpiar los datos
        const body = matchedData(req);
        // Verificar la existencia de la categoria
        const checkIsExist = await Categorias.findOne({ where: { rol: body.categoria } });
        if (checkIsExist) {
            handleErrorResponse(res, "Categoria Existente", 401);
            return;
        }
        // Crear nueva categoria
        const cat = await Categorias.create(body);
        const data = {
            ok: true,
            msg: 'Categoria creada exitosamente',
            cat
        };
        // Generar respuesta exitosa
        res.send(data);

    } catch (error) {
        // Error al crear categoria
        handleHttpError(res, "Error al crear Categoria!")
    }

}

// Editar categoria seleccionado
const updateCat = async (req, res = response) => {
    try {
        // Limpiar los datos
        const { id } = req.params;
        const body = matchedData(req);

        // Checkear id categoria existente
        const cat = await Categorias.findByPk(id);

        if (!cat) {
            handleErrorResponse(res, "La categoria no existe", 404);
            return;
        }

        await cat.update(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Categoria editada exitosamente',
            body,
        }

        res.send(data);

    } catch (error) {
        // Error al editar categoria
        handleHttpError(res, "Error al editar Categoria!")
    }
}

// Eliminar categoria
const deleteCat = async (req, res = response) => {
    try {
        // Eliminar usuario seleccionado
        const { id } = req.params;
        // Buscar si existe el registro
        const cat = await Categorias.findByPk(id);
        if (!cat) {
            handleErrorResponse(res, "Categoria no existente", 404);
            return;
        }
        // Eliminando datos
        await cat.destroy(cat);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Categoria eliminada exitosamente',
            cat
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "Error al eliminar categoria");
    }
}

module.exports = {
    getCat,
    getCats,
    createCat,
    updateCat,
    deleteCat
}