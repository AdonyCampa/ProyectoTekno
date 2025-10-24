const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Proveedor, Compra } = require("../models");
const { Op } = require("sequelize");

// Ver Proveedor
const getProveedorById = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;

    // Comprobar si existe el id ingresado
    const proveedor = await Proveedor.findByPk(id, {
      include: [
        {
          model: Compra,
          as: "compras",
          limit: 10,
          order: [["fecha", "DESC"]],
        },
      ],
    });

    if (!proveedor) {
      handleErrorResponse(res, "Proveedor no encontrado", 404);
      return;
    }

    const data = {
      success: true,
      data: proveedor,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    handleHttpError(res, "Error al obtener proveedor");
  }
};
// Ver Proveedores
const getProveedores = async (req, res = response) => {
  try {
    // Obtener datos
    const { estado, search, page = 1, limit = 10 } = req.query;
    const whereClause = {};

    if (estado) whereClause.estado = estado;
    if (search) {
      whereClause[Op.or] = [
        { empresa: { [Op.like]: `%${search}%` } },
        { contacto: { [Op.like]: `%${search}%` } },
        { nit: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Proveedor.findAndCountAll({
      where: whereClause,
      order: [["empresa", "ASC"]],
      limit: parseInt(limit),
      offset,
    });

    const data = {
      success: true,
      data: rows,

      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener proveedores");
  }
};

// Agregar un Proveedor nuevo
const createProveedor = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia de la Proveedor

    const existente = await Proveedor.findOne({
      where: { empresa: body.empresa },
    });
    if (existente) {
      handleErrorResponse(res, "Ya existe un proveedor con esa empresa", 400);
      return;
    }

    // Crear nueva Proveedor
    const proveedor = await Proveedor.create(body);
    const data = {
      success: true,
      message: "Proveedor creado exitosamente",
      data: proveedor,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    // Error al crear Proveedor
    handleHttpError(res, "Error al crear proveedor");
  }
};

// Editar Proveedor seleccionado
const updateProveedor = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id Proveedor existente
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      handleErrorResponse(res, "Proveedor no encontrado", 404);
      return;
    }

    if (body.empresa && body.empresa !== proveedor.empresa) {
      const existente = await Proveedor.findOne({
        where: { empresa: body.empresa },
      });
      if (existente) {
        handleErrorResponse(res, "Ya existe un proveedor con esa empresa", 404);
        return;
      }
    }

    await proveedor.update({
      empresa: body.empresa || proveedor.empresa,
      contacto:
        body.contacto !== undefined ? body.contacto : proveedor.contacto,
      nit: body.nit !== undefined ? body.nit : proveedor.nit,
      telefono:
        body.telefono !== undefined ? body.telefono : proveedor.telefono,
      email: body.email !== undefined ? body.email : proveedor.email,
      direccion:
        body.direccion !== undefined ? body.direccion : proveedor.direccion,
      estado: body.estado || proveedor.estado,
    });

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Proveedor actualizado exitosamente",
      data: proveedor,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    // Error al editar Proveedor
    handleHttpError(res, "Error al actualizar proveedor!");
  }
};

// Eliminar Proveedor
const deleteProveedor = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro

    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      handleErrorResponse(res, "Proveedor no encontrado", 404);
      return;
    }

    const comprasAsociadas = await Compra.count({
      where: { proveedor_id: id },
    });
    if (comprasAsociadas > 0) {
      handleErrorResponse(
        res,
        `No se puede eliminar el proveedor porque tiene ${comprasAsociadas} compra(s) registrada(s). Cambie el estado a inactivo.`,
        404
      );
      return;
    }

    // Eliminando datos
    await proveedor.destroy();

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Proveedor eliminado exitosamente",
      proveedor,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    handleHttpError(res, "Error al eliminar proveedor");
  }
};

module.exports = {
  getProveedorById,
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
