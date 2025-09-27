const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const Medidas = require("../models/medidas");

// Ver Medida
const getMedida = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const medida = await Medidas.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!medida) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Medida no existe", 404);
      return;
    }
    // Generar respuesta exitosa
    res.send(medida);
  } catch (error) {
    handleHttpError(res, "Error al buscar Medida");
  }
};
// Ver Medidas
const getMedidas = async (req, res = response) => {
  try {
    // Obtener datos
    const medida = await Medidas.findAll();

    // Mostrar datos
    res.send(medida);
  } catch (error) {
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener medidas");
  }
};

// Agregar nueva medida
const createMedida = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia de la categoria
    const checkIsExist = await Medidas.findOne({
      where: { medida: body.medida },
    });
    if (checkIsExist) {
      handleErrorResponse(res, "Medida Existente", 401);
      return;
    }
    // Crear nueva medida
    const medida = await Medidas.create(body);
    const data = {
      ok: true,
      msg: "Medida creada exitosamente",
      medida,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    // Error al crear categoria
    handleHttpError(res, "Error al crear Medida");
  }
};

// Editar medida seleccionado
const updateMedida = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id medida existente
    const medida = await Medidas.findByPk(id);

    if (!medida) {
      handleErrorResponse(res, "La medida no existe", 404);
      return;
    }

    await medida.update(body);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Medida editada exitosamente",
      body,
    };

    res.send(data);
  } catch (error) {
    // Error al editar categoria
    handleHttpError(res, "Error al editar Medida!");
  }
};

// Eliminar medida
const deleteMedida = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const medida = await Medidas.findByPk(id);
    if (!medida) {
      handleErrorResponse(res, "Medida no existente", 404);
      return;
    }
    // Eliminando datos
    await medida.destroy(medida);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Medida eliminada exitosamente",
      medida,
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar medida");
  }
};

module.exports = {
  getMedida,
  getMedidas,
  createMedida,
  updateMedida,
  deleteMedida,
};
