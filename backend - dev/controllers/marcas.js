const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Marca, Producto } = require("../models");
const { Op } = require("sequelize");

// Ver Marca
const getMarcaById = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const marca = await Marca.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!marca) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "Marca no encontrada", 404);
      return;
    }

    const data = {
      succes: true,
      data: marca,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al buscar Marca:", error);
    handleHttpError(res, "Error al buscar Marca");
  }
};
// Ver Marcas
const getMarcas = async (req, res = response) => {
  try {
    const { estado, search } = req.query;
    const whereClause = {};
    // Obtener datos
    if (estado) whereClause.estado = estado;
    if (search) whereClause.nombre = { [Op.like]: `%${search}%` };

    const marcas = await Marca.findAll({
      where: whereClause,
      order: [["nombre", "ASC"]],
    });

    const data = {
      succes: true,
      data: marcas,
    };
    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener marcas");
  }
};

// Agregar nueva marca
const createMarca = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia de la categoria
    const existente = await Marca.findOne({ where: { marca: body.marca } });
    if (existente) {
      handleErrorResponse(res, "Ya existe una marca con ese nombre", 400);
      return;
    }
    // Crear nueva marca
    const marca = await Marca.create(body);
    const data = {
      succes: true,
      message: "Marca creada exitosamente",
      data: marca,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al crear marca:", error);
    // Error al crear categoria
    handleHttpError(res, "Error al crear marca");
  }
};

// Editar marca seleccionado
const updateMarca = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id marca existente
    const marca = await Marca.findByPk(id);

    if (!marca) {
      handleErrorResponse(res, "Marca no encontradac", 404);
      return;
    }

    if (body.nombre && body.nombre !== marca.nombre) {
      const existente = await Marca.findOne({ where: { nombre: body.nombre } });
      if (existente) {
        handleErrorResponse(res, "Ya existe una marca con ese nombre", 404);
        return;
      }
    }

    await marca.update({
      nombre: body.nombre || marca.nombre,
      descripcion:
        body.descripcion !== undefined ? body.descripcion : marca.descripcion,
      estado: body.estado || marca.estado,
    });

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Marca actualizada exitosamente",
      data: body,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al actualizar marca:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al actualizar marca");
  }
};

// Eliminar marca
const deleteMarca = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const marca = await Marca.findByPk(id);
    if (!marca) {
      handleErrorResponse(res, "Marca no encontrada", 404);
      return;
    }

    const productosAsociados = await Producto.count({
      where: { marca_id: id },
    });
    if (productosAsociados > 0) {
      handleErrorResponse(
        res,
        `No se puede eliminar la marca porque tiene ${productosAsociados} producto(s) asociado(s)`,
        404
      );
      return;
    }

    // Eliminando datos
    await marca.destroy();

    // Generar respuesta exitosa
    const data = {
      success: true,
      messge: "Marca eliminada exitosamente",
      marca,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al eliminar marca:", error);
    handleHttpError(res, "Error al eliminar marca");
  }
};

module.exports = {
  getMarcaById,
  getMarcas,
  createMarca,
  updateMarca,
  deleteMarca,
};
