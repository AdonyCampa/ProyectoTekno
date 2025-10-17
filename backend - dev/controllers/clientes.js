const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Cliente, Venta } = require("../models");
const { Op } = require("sequelize");

// Ver Cliente
const getClienteById = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id, {
      include: [
        {
          model: Venta,
          as: "ventas",
          limit: 10,
          order: [["fecha", "DESC"]],
        },
      ],
    });

    // Comprobar si existe el id ingresado
    if (!cliente) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "Cliente no encontrado", 404);
      return;
    }

    const data = {
      success: true,
      data: cliente,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    handleHttpError(res, "Error al buscar cliente");
  }
};
// Ver Clientes
const getClientes = async (req, res = response) => {
  try {
    // Obtener datos
    const { estado, tipo, search, page = 1, limit = 10 } = req.query;
    const whereClause = {};

    if (estado) whereClause.estado = estado;
    if (tipo) whereClause.tipo = tipo;
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { nit: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Cliente.findAndCountAll({
      where: whereClause,
      order: [["nombre", "ASC"]],
      limit: parseInt(limit),
      offset,
    });

    const data = {
      success: true,
      data: {
        clientes: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    };

    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener clientes");
  }
};

// Agregar nueva Cliente
const createCliente = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);

    if (body.nit) {
      const existente = await Cliente.findOne({ where: { nit: body.nit } });
      if (existente) {
        handleErrorResponse(res, "a existe un cliente con ese NIT", 401);
        return;
      }
    }

    // Crear nueva Cliente
    const cliente = await Cliente.create({
      nombre: body.nombre,
      nit: body.nit,
      telefono: body.telefono,
      email: body.email,
      direccion: body.direccion,
      tipo: body.tipo || "individual",
      limite_credito: body.limite_credito || 0,
    });
    const data = {
      success: true,
      message: "Cliente creado exitosamente",
      data: cliente,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    // Error al crear categoria
    handleHttpError(res, "Error al crear cliente");
  }
};

// Editar Cliente seleccionado
const updateCliente = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id Cliente existente
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      handleErrorResponse(res, "El Cliente no encontrado", 404);
      return;
    }

    if (body.nit && body.nit !== cliente.nit) {
      const existente = await Cliente.findOne({ where: { nit: body.nit } });
      if (existente) {
        handleErrorResponse(res, "Ya existe un cliente con ese NIT", 404);
        return;
      }
    }

    await cliente.update({
      nombre: body.nombre || cliente.nombre,
      nit: body.nit !== undefined ? body.nit : cliente.nit,
      telefono: body.telefono !== undefined ? body.telefono : cliente.telefono,
      email: body.email !== undefined ? body.email : cliente.email,
      direccion:
        body.direccion !== undefined ? body.direccion : cliente.direccion,
      tipo: body.tipo || cliente.tipo,
      limite_credito:
        body.limite_credito !== undefined
          ? body.limite_credito
          : cliente.limite_credito,
      estado: body.estado || cliente.estado,
    });

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Cliente actualizado exitosamente",
      data: cliente,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al actualizar cliente");
  }
};

// Eliminar Cliente
const deleteCliente = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      handleErrorResponse(res, "Cliente no encontrado", 404);
      return;
    }

    const ventasAsociadas = await Venta.count({ where: { cliente_id: id } });
    if (ventasAsociadas > 0) {
      handleErrorResponse(
        res,
        `No se puede eliminar el cliente porque tiene ${ventasAsociadas} venta(s) registrada(s). Cambie el estado a inactivo.`,
        404
      );
      return;
    }

    // Eliminando datos
    await cliente.destroy();

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Cliente eliminado exitosamente",
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar Cliente");
  }
};

module.exports = {
  getClienteById,
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
};
