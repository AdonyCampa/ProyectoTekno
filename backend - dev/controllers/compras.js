const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const {
  Compra,
  DetalleCompra,
  Proveedor,
  Producto,
  Usuario,
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/mysql");

// Ver compras
const getCompras = async (req, res = response) => {
  try {
    const {
      estado,
      proveedor_id,
      fecha_inicio,
      fecha_fin,
      page = 1,
      limit = 10,
    } = req.query;
    const whereClause = {};

    if (estado) whereClause.estado = estado;
    if (proveedor_id) whereClause.proveedor_id = proveedor_id;

    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Compra.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Proveedor,
          as: "proveedor",
          attributes: ["id", "empresa", "contacto"],
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre"],
        },
      ],
      order: [["fecha", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const data = {
      success: true,
      data: {
        compras: rows,
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
    console.error("Error al obtener compras:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener compras");
  }
};

//Ver compra
const getCompraById = async (req, res = response) => {
  try {
    const { id } = req.params;

    const compra = await Compra.findByPk(id, {
      include: [
        {
          model: Proveedor,
          as: "proveedor",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre"],
        },
        {
          model: DetalleCompra,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "codigo", "nombre"],
            },
          ],
        },
      ],
    });

    if (!compra) {
      handleErrorResponse(res, "Compra no encontrada", 404);
      return;
    }

    const data = {
      success: true,
      data: compra,
    };

    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener compra:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener compra");
  }
};

// Agregar apertura de caja
const registrarCompra = async (req, res = response) => {
  const transaction = await sequelize.transaction();
  try {
    // Limpiar los datos
    const body = matchedData(req);
    const usuario_id = req.usuario.id;

    // Verificar proveedor
    const proveedor = await Proveedor.findByPk(body.proveedor_id);
    if (!proveedor) {
      await transaction.rollback();
      handleErrorResponse(res, "Proveedor no encontrado", 404);
      return;
    }
    // Validar detalles
    if (!body.detalles || body.detalles.length === 0) {
      await transaction.rollback();
      handleErrorResponse(
        res,
        "Debe incluir al menos un producto en la compra",
        404
      );
      return;
    }

    // Generar número de compra
    const ultimaCompra = await Compra.findOne({
      order: [["id", "DESC"]],
      attributes: ["id"],
    });
    const numeroCompra = `COMP-${String((ultimaCompra?.id || 0) + 1).padStart(
      6,
      "0"
    )}`;

    // Calcular totales
    let total = 0;
    const detallesValidados = [];

    for (const detalle of body.detalles) {
      const producto = await Producto.findByPk(detalle.producto_id);
      if (!producto) {
        await transaction.rollback();
        handleErrorResponse(
          res,
          `Producto con ID ${detalle.producto_id} no encontrado`,
          404
        );
        return;
      }

      const totalDetalle =
        parseFloat(detalle.cantidad) * parseFloat(detalle.precio_unitario);
      total += totalDetalle;

      detallesValidados.push({
        producto_id: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        total: totalDetalle,
        producto,
      });
    }

    // Crear compra
    const compra = await Compra.create(
      {
        numero_compra: numeroCompra,
        fecha: new Date(),
        proveedor_id: body.proveedor_id,
        total,
        tipo_pago: body.tipo_pago || "contado",
        estado: "completada",
        observaciones: body.observaciones,
        usuario_id: body.usuario_id,
      },
      { transaction }
    );

    // Crear detalles y actualizar inventario
    for (const detalle of detallesValidados) {
      await DetalleCompra.create(
        {
          compra_id: compra.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
        },
        { transaction }
      );

      // Actualizar stock del producto
      await detalle.producto.increment("stock_actual", {
        by: parseInt(detalle.cantidad),
        transaction,
      });

      // Actualizar precio de costo del producto
      await detalle.producto.update(
        {
          precio_costo: detalle.precio_unitario,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Obtener compra creada con relaciones
    const compraCreada = await Compra.findByPk(compra.id, {
      include: [
        {
          model: Proveedor,
          as: "proveedor",
        },
        {
          model: DetalleCompra,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "codigo", "nombre"],
            },
          ],
        },
      ],
    });

    const data = {
      success: true,
      message: "Compra registrada exitosamente",
      data: compraCreada,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al registrar compra:", error);
    // Error al crear realizar compra
    handleHttpError(res, "Error al registrar compra");
  }
};

// Anular compra
const anularCompra = async (req, res = response) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const compra = await Compra.findByPk(id, {
      include: [
        {
          model: DetalleCompra,
          as: "detalles",
        },
      ],
    });

    if (!compra) {
      await transaction.rollback();
      handleErrorResponse(res, "Compra no encontrada", 404);
      return;
    }

    if (compra.estado === "cancelada") {
      await transaction.rollback();
      handleErrorResponse(res, "La compra ya está cancelada", 404);
      return;
    }

    // Revertir inventario
    for (const detalle of compra.detalles) {
      const producto = await Producto.findByPk(detalle.producto_id);

      if (producto.stock_actual < detalle.cantidad) {
        await transaction.rollback();
        handleErrorResponse(
          res,
          `No hay suficiente stock del producto ${producto.nombre} para cancelar la compra`,
          404
        );
        return;
      }

      await producto.decrement("stock_actual", {
        by: parseInt(detalle.cantidad),
        transaction,
      });
    }

    // Actualizar estado de la compra
    await compra.update(
      {
        estado: "cancelada",
        observaciones: `${compra.observaciones || ""}\nCANCELADA: ${
          motivo || "Sin motivo especificado"
        }`,
      },
      { transaction }
    );

    await transaction.commit();

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Compra cancelada exitosamente",
      data: compra,
    };

    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al cancelar compra:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al cancelar compra");
  }
};

/**
 * Obtener estadísticas de compras
 */
const getEstadisticasCompras = async (req, res = response) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const whereClause = { estado: "completada" };

    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    const estadisticas = await Compra.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "total_compras"],
        [sequelize.fn("SUM", sequelize.col("total")), "monto_total"],
        [sequelize.fn("AVG", sequelize.col("total")), "promedio_compra"],
      ],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: estadisticas[0],
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al obtener estadísticas");
  }
};

module.exports = {
  getCompras,
  getCompraById,
  registrarCompra,
  anularCompra,
  getEstadisticasCompras,
};
