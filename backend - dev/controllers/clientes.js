const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const Clientes = require("../models/clientes");

// Ver Cliente
const getCliente = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const cliente = await Clientes.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!cliente) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Cliente no existe", 404);
      return;
    }
    // Generar respuesta exitosa
    res.send(cliente);
  } catch (error) {
    handleHttpError(res, "Error al buscar Cliente");
  }
};
// Ver Clientes
const getClientes = async (req, res = response) => {
  try {
    // Obtener datos
    const cliente = await Clientes.findAll();

    // Mostrar datos
    res.send(cliente);
  } catch (error) {
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener Clientes");
  }
};

// Agregar nueva Cliente
const createCliente = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia del cliente
    const checkIsExist = await Clientes.findOne({ where: { dpi: body.dpi } });
    if (checkIsExist) {
      handleErrorResponse(res, "Cliente Existente", 401);
      return;
    }
    // Crear nueva Cliente
    const cliente = await Clientes.create(body);
    const data = {
      ok: true,
      msg: "Cliente creado exitosamente",
      cliente,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    // Error al crear categoria
    handleHttpError(res, "Error al crear Cliente");
  }
};

// Editar Cliente seleccionado
const updateCliente = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id Cliente existente
    const cliente = await Clientes.findByPk(id);

    if (!cliente) {
      handleErrorResponse(res, "El Cliente no existe", 404);
      return;
    }

    await cliente.update(body);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Cliente editado exitosamente",
      body,
    };

    res.send(data);
  } catch (error) {
    // Error al editar categoria
    handleHttpError(res, "Error al editar Cliente!");
  }
};

// Eliminar Cliente
const deleteCliente = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const cliente = await Clientes.findByPk(id);
    if (!cliente) {
      handleErrorResponse(res, "Cliente no existente", 404);
      return;
    }
    // Eliminando datos
    await cliente.destroy(cliente);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Cliente eliminado exitosamente",
      cliente,
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar Cliente");
  }
};

module.exports = {
  getCliente,
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
};
