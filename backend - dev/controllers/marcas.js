const { response } = require('express');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');
const Categorias = require('../models/categorias');
const Marcas = require('../models/marcas');


// Ver Marca
const getMarca = async (req, res = response) => {
    try {
        // Obtener datos desde el frontend
        const { id } = req.params;
        const marca = await Marcas.findByPk(id);

        // Comprobar si existe el id ingresado
        if (!marca) {
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID Marca no existe", 404);
            return;
        }
        // Generar respuesta exitosa
        res.send(marca);
    } catch (error) {
        handleHttpError(res, "Error al buscar Marca");

    }
}
// Ver Marcas
const getMarcas = async (req, res = response) => {
    try {
        // Obtener datos
        const marca = await Marcas.findAll();

        // Mostrar datos
        res.send(marca);

    } catch (error) {

        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "Error al obtener marcas");

    }
}

// Agregar nueva marca
const createMarca = async (req, res = response) => {
    try {
        // Limpiar los datos
        const body = matchedData(req);
        // Verificar la existencia de la categoria
        const checkIsExist = await Marcas.findOne({ where: { rol: body.marca } });
        if (checkIsExist) {
            handleErrorResponse(res, "Marca Existente", 401);
            return;
        }
        // Crear nueva marca
        const marca = await Marcas.create(body);
        const data = {
            ok: true,
            msg: 'Marca creada exitosamente',
            marca
        };
        // Generar respuesta exitosa
        res.send(data);

    } catch (error) {
        // Error al crear categoria
        handleHttpError(res, "Error al crear Marca")
    }

}

// Editar marca seleccionado
const updateMarca = async (req, res = response) => {
    try {
        // Limpiar los datos
        const { id } = req.params;
        const body = matchedData(req);

        // Checkear id marca existente
        const marca = await Marcas.findByPk(id);

        if (!marca) {
            handleErrorResponse(res, "La marca no existe", 404);
            return;
        }

        await marca.update(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Marca editada exitosamente',
            body,
        }

        res.send(data);

    } catch (error) {
        // Error al editar categoria
        handleHttpError(res, "Error al editar Marca!")
    }
}

// Eliminar marca
const deleteMarca = async (req, res = response) => {
    try {
        // Eliminar usuario seleccionado
        const { id } = req.params;
        // Buscar si existe el registro
        const marca = await Marcas.findByPk(id);
        if (!marca) {
            handleErrorResponse(res, "Categoria no existente", 404);
            return;
        }
        // Eliminando datos
        await marca.destroy(marca);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Categoria eliminada exitosamente',
            marca
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "Error al eliminar categoria");
    }
}

module.exports = {
    getMarca,
    getMarcas,
    createMarca,
    updateMarca,
    deleteMarca
}