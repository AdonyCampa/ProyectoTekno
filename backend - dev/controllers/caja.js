const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const { CajaAperturas } = require("../models/caja");

// Ver Apertura
const getApertura = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const apertura = await CajaAperturas.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!apertura) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Apertura no existe", 404);
      return;
    }
    // Generar respuesta exitosa
    res.send(apertura);
  } catch (error) {
    handleHttpError(res, "Error al buscar apertura");
  }
};

// Ver Apertura
const getStatus = async (req, res = response) => {
  try {
    // Validar que no haya caja abierta
    const cajaAbierta = await CajaAperturas.findOne({
      where: { estado: 1 },
    });
    if (!cajaAbierta) {
      handleErrorResponse(res, "No existe una caja abierta", 404);
      return;
    }

    // Generar respuesta exitosa
    res.send(cajaAbierta);
  } catch (error) {
    handleHttpError(res, "Error al buscar apertura");
  }
};
// Ver Aperturas
const getAperturas = async (req, res = response) => {
  try {
    // Obtener datos
    const aperturas = await CajaAperturas.findAll();

    // Mostrar datos
    res.send(aperturas);
  } catch (error) {
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener aperturas");
  }
};

// Agregar apertura de caja
const Apertura = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);

    // Validar que no haya caja abierta
    const cajaAbierta = await CajaAperturas.findOne({
      where: { estado: 1 },
    });
    if (cajaAbierta) {
      handleErrorResponse(res, "Ya existe una caja abierta", 404);
      return;
    }

    // Aperturar Caja
    const caja = await CajaAperturas.create({
      usuario: body.usuario,
      monto_inicial: body.monto_inicial,
      apertura: new Date(),
      estado: true,
    });

    const data = {
      ok: true,
      msg: "Apertura de caja Exitosa",
      apertura: caja,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    // Error al crear categoria
    handleHttpError(res, "Error al aperturar caja");
  }
};

// Cerrar caja
const Cierre = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id categoria existente
    const caja = await CajaAperturas.findByPk(id);

    if (!caja) {
      handleErrorResponse(res, "La apertura no existe", 404);
      return;
    }
    if (caja.estado === false) {
      handleErrorResponse(res, "La caja ya esta cerrada", 404);
      return;
    }

    caja.cierre = new Date();
    caja.monto_final = body.monto_final;
    caja.estado = 0;

    await caja.save();

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Cierre de caja Exitoso",
      caja,
    };

    res.send(data);
  } catch (error) {
    // Error al editar categoria
    handleHttpError(res, "Error al cerrar caja!");
  }
};

// Eliminar Apertura
const deleteApertura = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const apertura = await CajaAperturas.findByPk(id);
    if (!apertura) {
      handleErrorResponse(res, "Apertura no existente", 404);
      return;
    }
    // Eliminando datos
    await apertura.destroy(apertura);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Apertura eliminada exitosamente",
      apertura,
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar apertera");
  }
};

module.exports = {
  getApertura,
  getStatus,
  getAperturas,
  Apertura,
  Cierre,
  deleteApertura,
};
