const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const { Caja, MovimientoCaja, Usuario } = require("../models");
const sequelize = require("../config/mysql");

/**
 * Obtener caja actual (abierta)
 */
const getCajaActual = async (req, res = response) => {
  try {
    const caja = await Caja.findOne({
      where: { estado: "abierta" },
      include: [
        {
          model: Usuario,
          as: "usuarioApertura",
          attributes: ["id", "nombres", "usuario"],
        },
        {
          model: MovimientoCaja,
          as: "movimientos",
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: ["id", "nombres"],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["fecha_apertura", "DESC"]],
    });

    if (!caja) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "No hay caja abierta actualmente", 404);
      return;
    }

    const data = {
      success: true,
      mesage: "Apertura de caja Exitosa",
      data: caja,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener caja actual:", error);
    handleHttpError(res, "Error al obtener caja actual", 500);
  }
};

/**
 * Abrir caja
 */
const abrirCaja = async (req, res = response) => {
  const transaction = await sequelize.transaction();
  try {
    // Limpiar los datos
    const body = matchedData(req);
    const usuario_id = req.id; // Asume middleware de autenticación
    console.log(body);

    // Verificar si hay una caja abierta
    const cajaAbierta = await Caja.findOne({
      where: { estado: "abierta" },
    });

    if (cajaAbierta) {
      await transaction.rollback();
      handleErrorResponse(
        res,
        "Ya existe una caja abierta. Debe cerrarla antes de abrir una nueva.",
        400
      );
      return;
    }

    // Aperturar Caja
    const nuevaCaja = await Caja.create(
      {
        fecha_apertura: new Date(),
        monto_inicial: body.monto_inicial,
        usuario_apertura: usuario_id,
        observaciones_apertura: body.observaciones,
        estado: "abierta",
      },
      { transaction }
    );

    // Crear movimiento de apertura
    await MovimientoCaja.create(
      {
        caja_id: nuevaCaja.id,
        tipo: "apertura",
        concepto: "Apertura de caja",
        descripcion: body.observaciones || "Apertura inicial de caja",
        monto: body.monto_inicial,
        usuario_id: usuario_id,
      },
      { transaction }
    );

    await transaction.commit();

    // Obtener caja con relaciones
    const cajaCreada = await Caja.findByPk(nuevaCaja.id, {
      include: [
        {
          model: Usuario,
          as: "usuarioApertura",
          attributes: ["id", "nombres", "apellidos", "usuario"],
        },
      ],
    });

    const data = {
      success: true,
      message: "Caja abierta exitosamente",
      data: cajaCreada,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al abrir caja:", error);
    // Error al crear categoria
    handleHttpError(res, "Error al aperturar caja");
  }
};

/**
 * Cerrar caja
 */
const cerrarCaja = async (req, res = response) => {
  const transaction = await sequelize.transaction();
  try {
    const body = matchedData(req);
    const usuario_id = req.id;

    // Buscar caja
    const caja = await Caja.findByPk(body.caja_id);

    if (!caja) {
      await transaction.rollback();
      handleErrorResponse(res, "Caja no encontrada", 404);
      return;
    }
    if (caja.estado === "cerrada") {
      handleErrorResponse(res, "La caja ya esta cerrada", 404);
      return;
    }

    // Calcular totales
    const movimientos = await MovimientoCaja.findAll({
      where: { caja_id: body.caja_id },
    });

    const total_ingresos = movimientos
      .filter((m) => m.tipo === "ingreso")
      .reduce((sum, m) => sum + parseFloat(m.monto), 0);

    const total_egresos = movimientos
      .filter((m) => m.tipo === "egreso")
      .reduce((sum, m) => sum + parseFloat(m.monto), 0);

    const saldo_esperado =
      parseFloat(caja.monto_inicial) + total_ingresos - total_egresos;
    const diferencia = parseFloat(body.monto_final) - saldo_esperado;

    // Actualizar caja
    await caja.update(
      {
        fecha_cierre: new Date(),
        monto_final: body.monto_final,
        total_ingresos,
        total_egresos,
        saldo_esperado,
        diferencia,
        estado: "cerrada",
        usuario_cierre: usuario_id,
        observaciones_cierre: body.observaciones,
      },
      { transaction }
    );

    // Crear movimiento de cierre
    await MovimientoCaja.create(
      {
        caja_id: body.caja_id,
        tipo: "cierre",
        concepto: "Cierre de caja",
        descripcion:
          body.observaciones ||
          `Cierre de caja - Diferencia: Q ${diferencia.toFixed(2)}`,
        monto: body.monto_final,
        usuario_id,
      },
      { transaction }
    );

    await transaction.commit();

    // Obtener caja actualizada
    const cajaCerrada = await Caja.findByPk(body.caja_id, {
      include: [
        {
          model: Usuario,
          as: "usuarioApertura",
          attributes: ["id", "usuario"],
        },
        {
          model: Usuario,
          as: "usuarioCierre",
          attributes: ["id", "usuario"],
        },
      ],
    });

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Cierre de caja Exitoso",
      data: cajaCerrada,
    };

    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al cerrar caja:", error);
    handleHttpError(res, "Error al cerrar caja");
  }
};

/**
 * Crear movimiento de caja
 */

const crearMovimiento = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const body = matchedData(req);
    const usuario_id = req.usuario.id;

    // Verificar que hay una caja abierta
    const cajaAbierta = await Caja.findOne({
      where: { estado: "abierta" },
    });

    if (!cajaAbierta) {
      await transaction.rollback();
      handleErrorResponse(
        res,
        "No hay caja abierta. Debe abrir una caja primero.",
        400
      );
      return;
    }

    // Crear movimiento
    const movimiento = await MovimientoCaja.create(
      {
        caja_id: cajaAbierta.id,
        tipo: body.tipo,
        concepto: body.concepto,
        descripcion: body.descripcion,
        monto: body.monto,
        referencia: body.referencia,
        usuario_id,
      },
      { transaction }
    );

    // Actualizar totales de la caja
    if (body.tipo === "ingreso") {
      await cajaAbierta.increment("total_ingresos", {
        by: parseFloat(body.monto),
        transaction,
      });
    } else if (body.tipo === "egreso") {
      await cajaAbierta.increment("total_egresos", {
        by: parseFloat(body.monto),
        transaction,
      });
    }

    await transaction.commit();

    // Obtener movimiento con relaciones
    const movimientoCreado = await MovimientoCaja.findByPk(movimiento.id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre"],
        },
      ],
    });

    const data = {
      success: true,
      message: "Movimiento registrado exitosamente",
      data: movimientoCreado,
    };
    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear movimiento:", error);
    handleHttpError(res, "Error al registrar el movimiento");
  }
};

/**
 * Obtener movimientos de caja
 */
const getMovimientos = async (req, res) => {
  try {
    const {
      caja_id,
      tipo,
      fecha_inicio,
      fecha_fin,
      page = 1,
      limit = 10,
    } = req.query;

    const whereClause = {};

    if (caja_id) whereClause.caja_id = caja_id;
    if (tipo) whereClause.tipo = tipo;

    if (fecha_inicio && fecha_fin) {
      whereClause.createdAt = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await MovimientoCaja.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "usuario"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const data = {
      success: true,
      data: {
        movimientos: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    handleHttpError(res, "Error al obtener los movimientos");
  }
};

/**
 * Obtener historial de cajas
 */
const getHistorialCajas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, estado, page = 1, limit = 10 } = req.query;

    const whereClause = {};

    if (estado) whereClause.estado = estado;

    if (fecha_inicio && fecha_fin) {
      whereClause.fecha_apertura = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Caja.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: "usuarioApertura",
          attributes: ["id", "usuario"],
        },
        {
          model: Usuario,
          as: "usuarioCierre",
          attributes: ["id", "usuario"],
        },
      ],
      order: [["fecha_apertura", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    res.status(200).json({
      success: true,
      data: {
        cajas: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener historial:", error);
    handleHttpError(res, "Error al obtener historial");
  }
};

/**
 * Obtener resumen/estadísticas
 */
const getEstadisticas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const whereClause = { estado: "cerrada" };

    if (fecha_inicio && fecha_fin) {
      whereClause.fecha_apertura = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    const cajas = await Caja.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "total_cajas"],
        [sequelize.fn("SUM", sequelize.col("monto_inicial")), "total_inicial"],
        [
          sequelize.fn("SUM", sequelize.col("total_ingresos")),
          "total_ingresos",
        ],
        [sequelize.fn("SUM", sequelize.col("total_egresos")), "total_egresos"],
        [sequelize.fn("SUM", sequelize.col("diferencia")), "total_diferencias"],
      ],
      raw: true,
    });

    const data = {
      success: true,
      data: cajas[0],
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    handleHttpError(res, "Error al obtener estadisticas");
  }
};

module.exports = {
  getCajaActual,
  abrirCaja,
  cerrarCaja,
  crearMovimiento,
  getMovimientos,
  getHistorialCajas,
  getEstadisticas,
};
