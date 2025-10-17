const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const {
  Producto,
  Categoria,
  Marca,
  Medida,
  DetalleCompra,
  DetalleVenta,
  Compra,
  Venta,
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/mysql");

/**
 * Obtener reporte de inventario
 */
const getReporteInventario = async (req, res = response) => {
  try {
    const { categoria_id, marca_id, estado, search } = req.query;
    const whereClause = {};

    if (categoria_id) whereClause.categoria_id = categoria_id;
    if (marca_id) whereClause.marca_id = marca_id;
    if (estado) whereClause.estado = estado;

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { codigo: { [Op.like]: `%${search}%` } },
      ];
    }

    const productos = await Producto.findAll({
      where: whereClause,
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "nombre"],
        },
        {
          model: Marca,
          as: "marca",
          attributes: ["id", "nombre"],
        },
        {
          model: Medida,
          as: "medida",
          attributes: ["id", "nombre", "abreviatura"],
        },
      ],
      order: [["nombre", "ASC"]],
    });

    // Calcular valor del inventario
    const valorInventario = productos.reduce((sum, producto) => {
      return (
        sum +
        parseFloat(producto.stock_actual) * parseFloat(producto.precio_costo)
      );
    }, 0);

    const totalProductos = productos.length;
    const productosBajoStock = productos.filter(
      (p) => p.stock_actual <= p.stock_minimo
    ).length;
    const productosSinStock = productos.filter(
      (p) => p.stock_actual === 0
    ).length;

    const data = {
      success: true,
      data: {
        resumen: {
          total_productos: totalProductos,
          productos_bajo_stock: productosBajoStock,
          productos_sin_stock: productosSinStock,
          valor_inventario: valorInventario,
        },
        productos,
      },
    };

    res.send(data);
  } catch (error) {
    console.error("Error al obtener reporte de inventario:", error);
    handleHttpError(res, "Error al obtener reporte de inventario");
  }
};

/**
 * Obtener productos con bajo stock
 */
const getProductosBajoStock = async (req, res = response) => {
  try {
    const productos = await Producto.findAll({
      where: {
        estado: "activo",
        stock_actual: {
          [Op.lte]: sequelize.col("stock_minimo"),
        },
      },
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "nombre"],
        },
        {
          model: Marca,
          as: "marca",
          attributes: ["id", "nombre"],
        },
      ],
      order: [["stock_actual", "ASC"]],
    });

    const data = {
      success: true,
      data: productos,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al obtener productos con bajo stock:", error);
    handleHttpError(res, "Error al obtener productos con bajo stock");
  }
};

/**
 * Obtener movimientos de inventario de un producto
 */
const getMovimientosProducto = async (req, res = response) => {
  try {
    const { producto_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;

    const producto = await Producto.findByPk(producto_id);
    if (!producto) {
      handleErrorResponse(res, "Producto no encontrado", 404);
      return;
    }

    const whereClauseCompras = { producto_id };
    const whereClauseVentas = { producto_id };

    if (fecha_inicio && fecha_fin) {
      whereClauseCompras["$compra.fecha$"] = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
      whereClauseVentas["$venta.fecha$"] = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    // Obtener compras
    const compras = await DetalleCompra.findAll({
      where: whereClauseCompras,
      include: [
        {
          model: Compra,
          as: "compra",
          attributes: ["id", "numero_compra", "fecha", "estado"],
          include: [
            {
              model: require("../models").Proveedor,
              as: "proveedor",
              attributes: ["id", "empresa"],
            },
          ],
        },
      ],
      order: [[{ model: Compra, as: "compra" }, "fecha", "DESC"]],
    });

    // Obtener ventas
    const ventas = await DetalleVenta.findAll({
      where: whereClauseVentas,
      include: [
        {
          model: Venta,
          as: "venta",
          attributes: ["id", "numero_venta", "fecha", "estado"],
          include: [
            {
              model: require("../models").Cliente,
              as: "cliente",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
      order: [[{ model: Venta, as: "venta" }, "fecha", "DESC"]],
    });

    // Combinar y ordenar movimientos
    const movimientos = [];

    compras.forEach((compra) => {
      movimientos.push({
        tipo: "entrada",
        fecha: compra.compra.fecha,
        referencia: compra.compra.numero_compra,
        cantidad: compra.cantidad,
        precio: compra.precio_unitario,
        tercero: compra.compra.proveedor.empresa,
        estado: compra.compra.estado,
      });
    });

    ventas.forEach((venta) => {
      movimientos.push({
        tipo: "salida",
        fecha: venta.venta.fecha,
        referencia: venta.venta.numero_venta,
        cantidad: venta.cantidad,
        precio: venta.precio_unitario,
        tercero: venta.venta.cliente.nombre,
        estado: venta.venta.estado,
      });
    });

    // Ordenar por fecha descendente
    movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const data = {
      success: true,
      data: {
        producto: {
          id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          stock_actual: producto.stock_actual,
        },
        movimientos,
      },
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener movimientos del producto:", error);
    handleHttpError(res, "Error al obtener movimientos del producto");
  }
};

/**
 * Ajustar inventario manualmente
 */
const ajustarInventario = async (req, res = response) => {
  const transaction = await sequelize.transaction();

  try {
    const { producto_id, tipo, cantidad, motivo } = req.body;
    const usuario_id = req.usuario.id;

    const producto = await Producto.findByPk(producto_id);
    if (!producto) {
      await transaction.rollback();
      handleErrorResponse(res, "Producto no encontrado", 404);
      return;
    }

    const cantidadAjuste = parseInt(cantidad);

    if (tipo === "incremento") {
      await producto.increment("stock_actual", {
        by: cantidadAjuste,
        transaction,
      });
    } else if (tipo === "decremento") {
      if (producto.stock_actual < cantidadAjuste) {
        await transaction.rollback();
        handleErrorResponse(
          res,
          "No hay suficiente stock para realizar el ajuste",
          404
        );
        return;
      }

      await producto.decrement("stock_actual", {
        by: cantidadAjuste,
        transaction,
      });
    } else {
      await transaction.rollback();
      handleErrorResponse(
        res,
        'Tipo de ajuste inválido. Use "incremento" o "decremento"',
        404
      );
      return;
    }

    await transaction.commit();

    // Obtener producto actualizado
    const productoActualizado = await Producto.findByPk(producto_id);

    const data = {
      success: true,
      message: "Inventario ajustado exitosamente",
      data: {
        producto: productoActualizado,
        ajuste: {
          tipo,
          cantidad: cantidadAjuste,
          motivo,
          usuario_id,
        },
      },
    };
    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al ajustar inventario:", error);
    handleHttpError(res, "Error al ajustar inventario");
  }
};

/**
 * Obtener valor total del inventario
 */
const getValorInventario = async (req, res = response) => {
  try {
    const { categoria_id, marca_id } = req.query;
    const whereClause = { estado: "activo" };

    if (categoria_id) whereClause.categoria_id = categoria_id;
    if (marca_id) whereClause.marca_id = marca_id;

    const productos = await Producto.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "total_productos"],
        [sequelize.fn("SUM", sequelize.col("stock_actual")), "total_unidades"],
        [
          sequelize.fn("SUM", sequelize.literal("stock_actual * precio_costo")),
          "valor_costo",
        ],
        [
          sequelize.fn("SUM", sequelize.literal("stock_actual * precio_venta")),
          "valor_venta",
        ],
      ],
      raw: true,
    });

    const data = {
      success: true,
      data: productos[0],
    };
    res.send(data);
  } catch (error) {
    console.error("Error al calcular valor del inventario:", error);
    handleHttpError(res, "Error al calcular valor del inventario");
  }
};

/**
 * Obtener alertas de inventario
 */
const getAlertasInventario = async (req, res = response) => {
  try {
    // Productos sin stock
    const sinStock = await Producto.count({
      where: {
        estado: "activo",
        stock_actual: 0,
      },
    });

    // Productos con bajo stock
    const bajoStock = await Producto.count({
      where: {
        estado: "activo",
        stock_actual: {
          [Op.gt]: 0,
          [Op.lte]: sequelize.col("stock_minimo"),
        },
      },
    });

    // Productos sobre stock máximo
    const sobreStock = await Producto.count({
      where: {
        estado: "activo",
        stock_actual: {
          [Op.gt]: sequelize.col("stock_maximo"),
        },
      },
    });

    const data = {
      success: true,
      data: {
        sin_stock: sinStock,
        bajo_stock: bajoStock,
        sobre_stock: sobreStock,
        total_alertas: sinStock + bajoStock + sobreStock,
      },
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    handleHttpError(res, "Error al obtener alertas de inventario");
  }
};

module.exports = {
  getReporteInventario,
  getProductosBajoStock,
  getMovimientosProducto,
  ajustarInventario,
  getValorInventario,
  getAlertasInventario,
};
