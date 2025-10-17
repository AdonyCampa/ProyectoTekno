const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Categoria, Producto } = require("../models");
const { Op } = require("sequelize");

// Ver Categoria
const getCategoriaById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!categoria) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "Categoría no encontrada", 404);
      return;
    }

    const data = {
      succes: true,
      data: categoria,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    handleHttpError(res, "Error al obtener categoría");
  }
};
// Ver Categorias
const getCategorias = async (req, res = response) => {
  try {
    const { estado, search } = req.query;
    const whereClause = {};

    if (estado) whereClause.estado = estado;
    if (search) whereClause.nombre = { [Op.like]: `%${search}%` };

    const categorias = await Categoria.findAll({
      where: whereClause,
      order: [["nombre", "ASC"]],
    });

    const data = {
      succes: true,
      data: categorias,
    };

    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener categorías");
  }
};

// Agregar un Categoria nueva
const createCategoria = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia de la categoria
    const existente = await Categoria.findOne({
      where: { nombre: body.nombre },
    });
    if (existente) {
      handleErrorResponse(res, "Ya existe una categoría con ese nombre", 400);
      return;
    }
    // Crear nueva categoria
    const categoria = await Categoria.create(body);
    const data = {
      succes: true,
      messge: "Categoría creada exitosamente",
      data: categoria,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    // Error al crear categoria
    handleHttpError(res, "Error al crear categoría");
  }
};

// Editar categoria seleccionado
const updateCategoria = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id categoria existente
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      handleErrorResponse(res, "Categoría no encontrada", 404);
      return;
    }

    if (body.nombre && body.nombre !== categoria.nombre) {
      const existente = await Categoria.findOne({
        where: { nombre: body.nombre },
      });
      if (existente) {
        handleErrorResponse(res, "Ya existe una categoría con ese nombre", 400);
        return;
      }
    }

    await categoria.update({
      nombre: body.nombre || categoria.nombre,
      descripcion:
        body.descripcion !== undefined
          ? body.descripcion
          : categoria.descripcion,
      estado: body.estado || categoria.estado,
    });

    // Generar respuesta exitosa
    const data = {
      succes: true,
      message: "Categoria actualizada exitosamente",
      data: body,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al actualizar categoría");
  }
};

// Eliminar categoria
const deleteCategoria = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      handleErrorResponse(res, "Categoría no encontrada", 404);
      return;
    }

    const productosAsociados = await Producto.count({
      where: { categoria_id: id },
    });
    if (productosAsociados > 0) {
      handleErrorResponse(
        res,
        `No se puede eliminar la categoría porque tiene ${productosAsociados} producto(s) asociado(s)`,
        404
      );
      return;
    }
    // Eliminando datos
    await categoria.destroy();

    // Generar respuesta exitosa
    const data = {
      succes: true,
      message: "Categoria eliminada exitosamente",
    };
    res.send(data);
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    handleHttpError(res, "Error al eliminar categoría");
  }
};

module.exports = {
  getCategoriaById,
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
