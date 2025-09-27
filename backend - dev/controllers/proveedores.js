const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const Proveedores = require("../models/proveedores");

// Ver Proveedor
const getProveedor = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const proveedor = await Proveedores.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!proveedor) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Proveedor no existe", 404);
      return;
    }
    // Generar respuesta exitosa
    res.send(proveedor);
  } catch (error) {
    handleHttpError(res, "Error al buscar Proveedor");
  }
};
// Ver Proveedores
const getProveedores = async (req, res = response) => {
  try {
    // Obtener datos
    const proveedor = await Proveedores.findAll();

    // Mostrar datos
    res.send(proveedor);
  } catch (error) {
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener Proveedores");
  }
};

// Agregar un Proveedor nuevo
const createProveedor = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia de la Proveedor
    const checkIsExist = await Proveedores.findOne({
      where: { empresa: body.empresa },
    });
    if (checkIsExist) {
      handleErrorResponse(res, "Proveedor Existente", 401);
      return;
    }
    // Crear nueva Proveedor
    const proveedor = await Proveedores.create(body);
    const data = {
      ok: true,
      msg: "Proveedor creado exitosamente",
      proveedor,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    // Error al crear Proveedor
    handleHttpError(res, "Error al crear Proveedor!");
  }
};

// Editar Proveedor seleccionado
const updateProveedor = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id Proveedor existente
    const proveedor = await Proveedores.findByPk(id);

    if (!proveedor) {
      handleErrorResponse(res, "El Proveedor no existe", 404);
      return;
    }

    await proveedor.update(body);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Proveedor editado exitosamente",
      body,
    };

    res.send(data);
  } catch (error) {
    // Error al editar Proveedor
    handleHttpError(res, "Error al editar Proveedor!");
  }
};

// Eliminar Proveedor
const deleteProveedor = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const proveedor = await Proveedores.findByPk(id);
    if (!proveedor) {
      handleErrorResponse(res, "El Proveedor no existente", 404);
      return;
    }
    // Eliminando datos
    await proveedor.destroy(proveedor);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Proveedor eliminado exitosamente",
      proveedor,
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar Proveedor");
  }
};

module.exports = {
  getProveedor,
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
