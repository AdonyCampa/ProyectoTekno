const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const { CajaMovimientos, CajaAperturas } = require("../models/caja");

// Ver Apertura
const getMovimientosDay = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const movimientos = await CajaMovimientos.findAll({
      where: { apertura: id },
      order: [["fecha", "DESC"]],
    });

    // Comprobar si existe el id ingresado
    if (!movimientos) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Movimiento no existe", 404);
      return;
    }
    // Generar respuesta exitosa
    res.send(movimientos);
  } catch (error) {
    console.log(error);

    handleHttpError(res, "Error al buscar movimientos del dia");
  }
};
// Ver Aperturas
const getMovimientos = async (req, res = response) => {
  try {
    // Obtener datos
    const movimientos = await CajaMovimientos.findAll({
      order: [["fecha", "DESC"]],
    });

    // Mostrar datos
    res.send(movimientos);
  } catch (error) {
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener aperturas");
  }
};

// Agregar movimiento de caja
const Movimiento = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    const fecha = new Date();
    const bodyInsert = { ...body, fecha };

    // Checkear apertura de caja existente
    const apertura = await CajaAperturas.findOne({
      where: { id: body.apertura },
    });

    if (!apertura) {
      handleErrorResponse(res, "Caja no existente", 404);
      return;
    }

    const movimiento = await CajaMovimientos.create(bodyInsert);

    const data = {
      ok: true,
      msg: "Movimiento registrado exitosamente",
      movimiento,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.log(error);

    // Error al crear categoria
    handleHttpError(res, "Error al registrar movimiento de caja");
  }
};

// Editar Movimiento
const updateMovimiento = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id movimiento existente
    const movimiento = await CajaMovimientos.findByPk(id);

    if (!movimiento) {
      handleErrorResponse(res, "Movimiento de caja no existe", 404);
      return;
    }

    await movimiento.update(body);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Movimiento de caja Exitoso",
      movimiento,
    };

    res.send(data);
  } catch (error) {
    // Error al editar categoria
    handleHttpError(res, "Error al editar movimiento de caja!");
  }
};

// Eliminar Movimiento
const deleteMovimiento = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const movimiento = await CajaMovimientos.findByPk(id);
    if (!movimiento) {
      handleErrorResponse(res, "Movimiento no existente", 404);
      return;
    }
    // Eliminando datos
    await movimiento.destroy(movimiento);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Movimiento eliminado exitosamente",
      movimiento,
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar movimiento");
  }
};

module.exports = {
  getMovimientosDay,
  getMovimientos,
  Movimiento,
  updateMovimiento,
  deleteMovimiento,
};
