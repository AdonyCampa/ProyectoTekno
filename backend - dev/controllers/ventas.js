const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const {
  Venta,
  DetalleVenta,
  Cliente,
  Producto,
  Usuario,
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/mysql");

// Ver ventas
const getVentas = async (req, res = response) => {
  try {
    const {
      estado,
      cliente_id,
      fecha_inicio,
      fecha_fin,
      page = 1,
      limit = 10,
    } = req.query;
    const whereClause = {};

    if (estado) whereClause.estado = estado;
    if (cliente_id) whereClause.cliente_id = cliente_id;

    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Venta.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "nombre", "nit"],
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
        ventas: rows,
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
    console.error("Error al obtener ventas:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener ventas");
  }
};

//Ver venta
const getVentaById = async (req, res = response) => {
  try {
    const { id } = req.params;

    const venta = await Venta.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: "cliente",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre"],
        },
        {
          model: DetalleVenta,
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

    if (!venta) {
      handleErrorResponse(res, "Venta no encontrada", 404);
      return;
    }
    const data = {
      success: true,
      data: venta,
    };

    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener venta:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener venta");
  }
};

// Registrar venta
const registrarVenta = async (req, res = response) => {
  const transaction = await sequelize.transaction();
  try {
    // Limpiar los datos
    const body = matchedData(req);
    const usuario_id = req.usuario.id;

    // Verificar cliente
    const cliente = await Cliente.findByPk(body.cliente_id);
    if (!cliente) {
      await transaction.rollback();
      handleErrorResponse(res, "Cliente no encontrado", 404);
      return;
    }

    // Validar detalles
    if (!body.detalles || body.detalles.length === 0) {
      await transaction.rollback();
      handleErrorResponse(
        res,
        "Debe incluir al menos un producto en la venta",
        400
      );
      return;
    }

    // Generar número de venta
    const ultimaVenta = await Venta.findOne({
      order: [["id", "DESC"]],
      attributes: ["id"],
    });
    const numeroVenta = `VENTA-${String((ultimaVenta?.id || 0) + 1).padStart(
      6,
      "0"
    )}`;

    // Calcular totales y validar stock
    let total = 0;
    const detallesValidados = [];

    for (const detalle of body.detalles) {
      const producto = await Producto.findByPk(detalle.producto_id);

      if (!producto) {
        await transaction.rollback();
        handleErrorResponse(
          res,
          `Producto con ID ${detalle.producto_id} no encontrado`,
          400
        );
        return;
      }

      // Verificar stock disponible
      if (producto.stock_actual < detalle.cantidad) {
        await transaction.rollback();
        handleErrorResponse(
          res,
          `Stock insuficiente para el producto ${producto.nombre}. Disponible: ${producto.stock_actual}`,
          400
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
        subtotal: subtotalDetalle,
        producto,
      });
    }

    // Verificar límite de crédito si es venta a crédito
    if (tipo_pago === "credito") {
      const saldoDisponible =
        parseFloat(cliente.limite_credito) - parseFloat(cliente.saldo_actual);
      if (total > saldoDisponible) {
        await transaction.rollback();
        handleErrorResponse(
          res,
          `El cliente no tiene suficiente límite de crédito. Disponible: Q ${saldoDisponible.toFixed(
            2
          )}`,
          400
        );
        return;
      }
    }

    // Crear venta
    const venta = await Venta.create(
      {
        numero_venta: numeroVenta,
        fecha: new Date(),
        cliente_id: body.cliente_id,
        total: total,
        tipo_pago: body.tipo_pago || "efectivo",
        estado: "completada",
        observaciones: body.observaciones,
        usuario_id: body.usuario_id,
      },
      { transaction }
    );

    // Crear detalles y actualizar inventario
    for (const detalle of detallesValidados) {
      await DetalleVenta.create(
        {
          venta_id: venta.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
        },
        { transaction }
      );

      // Reducir stock del producto
      await detalle.producto.decrement("stock_actual", {
        by: parseInt(detalle.cantidad),
        transaction,
      });
    }

    // Actualizar saldo del cliente si es a crédito
    if (tipo_pago === "credito") {
      await cliente.increment("saldo_actual", {
        by: parseFloat(total),
        transaction,
      });
    }

    await transaction.commit();

    // Obtener venta creada con relaciones
    const ventaCreada = await Venta.findByPk(venta.id, {
      include: [
        {
          model: Cliente,
          as: "cliente",
        },
        {
          model: DetalleVenta,
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
      message: "Venta registrada exitosamente",
      data: ventaCreada,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al registrar venta:", error);
    // Error al crear realizar compra
    handleHttpError(res, "Error al registrar venta");
  }
};

// Anular venta
const anularVenta = async (req, res = response) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const venta = await Venta.findByPk(id, {
      include: [
        {
          model: DetalleVenta,
          as: "detalles",
        },
        {
          model: Cliente,
          as: "cliente",
        },
      ],
    });

    if (!venta) {
      await transaction.rollback();
      handleErrorResponse(res, "Venta no encontrada", 404);
      return;
    }

    if (venta.estado === "cancelada") {
      await transaction.rollback();
      handleErrorResponse(res, "La venta ya está cancelada", 404);
      return;
    }

    // Devolver inventario
    for (const detalle of venta.detalles) {
      const producto = await Producto.findByPk(detalle.producto_id);

      await producto.increment("stock_actual", {
        by: parseInt(detalle.cantidad),
        transaction,
      });
    }

    // Revertir saldo del cliente si fue a crédito
    if (venta.tipo_pago === "credito") {
      await venta.cliente.decrement("saldo_actual", {
        by: parseFloat(venta.total),
        transaction,
      });
    }

    // Actualizar estado de la venta
    await venta.update(
      {
        estado: "cancelada",
        observaciones: `${venta.observaciones || ""}\nCANCELADA: ${
          motivo || "Sin motivo especificado"
        }`,
      },
      { transaction }
    );

    await transaction.commit();

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Venta cancelada exitosamente",
      data: compra,
    };

    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al cancelar venta:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al cancelar venta");
  }
};

/**
 * Obtener estadísticas de ventas
 */
const getEstadisticasVentas = async (req, res = response) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const whereClause = { estado: "completada" };

    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    const estadisticas = await Venta.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "total_ventas"],
        [sequelize.fn("SUM", sequelize.col("total")), "monto_total"],
        [sequelize.fn("AVG", sequelize.col("total")), "promedio_venta"],
        [sequelize.fn("SUM", sequelize.col("descuento")), "total_descuentos"],
      ],
      raw: true,
    });

    // Ventas por tipo de pago
    const ventasPorTipoPago = await Venta.findAll({
      where: whereClause,
      attributes: [
        "tipo_pago",
        [sequelize.fn("COUNT", sequelize.col("id")), "cantidad"],
        [sequelize.fn("SUM", sequelize.col("total")), "monto"],
      ],
      group: ["tipo_pago"],
      raw: true,
    });

    const data = {
      success: true,
      data: {
        general: estadisticas[0],
        por_tipo_pago: ventasPorTipoPago,
      },
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al obtener estadísticas");
  }
};

/**
 * Obtener reporte de ventas del día
 */
const getReporteVentasDia = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const ventas = await Venta.findAll({
      where: {
        fecha: {
          [Op.between]: [hoy, manana],
        },
        estado: "completada",
      },
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "nombre"],
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre"],
        },
      ],
      order: [["fecha", "DESC"]],
    });

    const totalVentas = ventas.reduce(
      (sum, venta) => sum + parseFloat(venta.total),
      0
    );
    const totalDescuentos = ventas.reduce(
      (sum, venta) => sum + parseFloat(venta.descuento),
      0
    );

    const data = {
      success: true,
      data: {
        fecha: hoy.toISOString().split("T")[0],
        cantidad_ventas: ventas.length,
        total_ventas: totalVentas,
        total_descuentos: totalDescuentos,
        ventas,
      },
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener reporte del día:", error);
    handleHttpError(res, "Error al obtener reporte del día");
  }
};

/**
 * Obtener productos más vendidos
 */
const getProductosMasVendidos = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, limit = 10 } = req.query;

    // Condición dinámica de fechas
    const whereClause = {
      estado: "completada",
      ...(fecha_inicio && fecha_fin
        ? {
            fecha: {
              [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
            },
          }
        : {}),
    };

    const productosMasVendidos = await DetalleVenta.findAll({
      attributes: [
        "producto_id",
        [sequelize.fn("SUM", sequelize.col("cantidad")), "total_vendido"],
        [sequelize.fn("SUM", sequelize.col("subtotal")), "total_ingresos"],
      ],
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: ["id", "codigo", "nombre", "precio_venta"],
        },
        {
          model: Venta,
          as: "venta",
          attributes: [],
          where: { estado: "completada" },
        },
      ],
      where: whereClause,
      group: ["producto_id", "producto.id"],
      order: [[sequelize.fn("SUM", sequelize.col("cantidad")), "DESC"]],
      limit: parseInt(limit),
      raw: false,
    });

    const data = {
      success: true,
      data: productosMasVendidos,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    handleHttpError(res, "Error al obtener productos más vendidos");
  }
};

module.exports = {
  getVentas,
  getVentaById,
  registrarVenta,
  anularVenta,
  getEstadisticasVentas,
  getReporteVentasDia,
  getProductosMasVendidos,
};
