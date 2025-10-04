const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Productos, ProductosList } = require("../models/productos");

// Ver Producto
const getProducto = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const producto = await Productos.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!producto) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Producto no existe", 404);
      return;
    }
    // Generar respuesta exitosa
    res.send(producto);
  } catch (error) {
    handleHttpError(res, "Error al buscar Producto");
  }
};
// Ver Productos
const getProductos = async (req, res = response) => {
  try {
    // Obtener datos
    const producto = await ProductosList.findAll();

    // Mostrar datos
    res.send(producto);
  } catch (error) {
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener Productos");
  }
};

// Agregar un Producto nuevo
const createProducto = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);

    // Crear nueva Producto
    const producto = await Productos.create(body);
    const data = {
      ok: true,
      msg: "Producto creado exitosamente",
      producto,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.log(error);

    // Error al crear Producto
    handleHttpError(res, "Error al crear Producto!");
  }
};

// Editar Producto seleccionado
const updateProducto = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id Producto existente
    const producto = await Productos.findByPk(id);

    if (!producto) {
      handleErrorResponse(res, "El Producto no existe", 404);
      return;
    }

    await producto.update(body);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Producto editado exitosamente",
      body,
    };

    res.send(data);
  } catch (error) {
    console.log(error);

    // Error al editar Producto
    handleHttpError(res, "Error al editar Producto!");
  }
};

// Eliminar Producto
const deleteProducto = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const producto = await Productos.findByPk(id);
    if (!producto) {
      handleErrorResponse(res, "El Producto no existente", 404);
      return;
    }
    // Eliminando datos
    await producto.destroy(producto);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Producto eliminado exitosamente",
      producto,
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar Producto");
  }
};

module.exports = {
  getProducto,
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
};
