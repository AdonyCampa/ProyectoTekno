const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const { Medida, Producto } = require("../models");
const { Op } = require("sequelize");

// Ver Medida
const getMedidaById = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const medida = await Medida.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!medida) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "Medida no encontrada", 404);
      return;
    }

    const data = {
      success: true,
      data: medida,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener medida:", error);
    handleHttpError(res, "Error al obtener medida");
  }
};
// Ver Medidas
const getMedidas = async (req, res = response) => {
  try {
    const { estado, search } = req.query;
    const whereClause = {};

    if (estado) whereClause.estado = estado;
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { abreviatura: { [Op.like]: `%${search}%` } },
      ];
    }
    // Obtener datos
    const medidas = await Medida.findAll({
      where: whereClause,
      order: [["nombre", "ASC"]],
    });

    const data = {
      success: true,
      data: medidas,
    };
    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener medidas:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener medidas");
  }
};

// Agregar nueva medida
const createMedida = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia de la medida
    const existenteNombre = await Medida.findOne({
      where: { nombre: body.nombre },
    });
    if (existenteNombre) {
      handleErrorResponse(res, "Ya existe una medida con ese nombre", 400);
      return;
    }

    const existenteAbrev = await Medida.findOne({
      where: { abreviatura: body.abreviatura },
    });
    if (existenteAbrev) {
      handleErrorResponse(res, "Ya existe una medida con esa abreviatura", 400);
      return;
    }

    // Crear nueva medida
    const medida = await Medida.create(body);
    const data = {
      success: true,
      message: "Medida creada exitosamente",
      medida,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al crear medida:", error);
    // Error al crear categoria
    handleHttpError(res, "Error al crear medida");
  }
};

// Editar medida seleccionado
const updateMedida = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id medida existente
    const medida = await Medida.findByPk(id);

    if (!medida) {
      handleErrorResponse(res, "Medida no encontrada", 404);
      return;
    }

    if (body.nombre && body.nombre !== medida.nombre) {
      const existente = await Medida.findOne({
        where: { nombre: body.nombre },
      });
      if (existente) {
        handleErrorResponse(res, "Ya existe una medida con ese nombre", 404);
        return;
      }
    }

    if (body.abreviatura && body.abreviatura !== medida.abreviatura) {
      const existente = await Medida.findOne({
        where: { abreviatura: body.abreviatura },
      });
      if (existente) {
        handleErrorResponse(
          res,
          "Ya existe una medida con esa abreviatura",
          404
        );
        return;
      }
    }

    await medida.update({
      nombre: body.nombre || medida.nombre,
      abreviatura: body.abreviatura || medida.abreviatura,
      descripcion:
        body.descripcion !== undefined ? body.descripcion : medida.descripcion,
      estado: body.estado || medida.estado,
    });

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Medida editada exitosamente",
      data: body,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al actualizar medida:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al editar medida");
  }
};

// Eliminar medida
const deleteMedida = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const medida = await Medida.findByPk(id);
    if (!medida) {
      handleErrorResponse(res, "Medida no encontrada", 404);
      return;
    }

    const productosAsociados = await Producto.count({
      where: { medida_id: id },
    });
    if (productosAsociados > 0) {
      handleErrorResponse(
        res,
        `No se puede eliminar la medida porque tiene ${productosAsociados} producto(s) asociado(s)`,
        404
      );
      return;
    }

    // Eliminando datos
    await medida.destroy();

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Medida eliminada exitosamente",
    };
    res.send(data);
  } catch (error) {
    console.error("Error al eliminar medida:", error);
    handleHttpError(res, "Error al eliminar medida");
  }
};

module.exports = {
  getMedidaById,
  getMedidas,
  createMedida,
  updateMedida,
  deleteMedida,
};
