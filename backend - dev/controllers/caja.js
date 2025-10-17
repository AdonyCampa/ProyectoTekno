const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const { CajaAperturas, Cajas } = require("../models/caja");

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
      succes: true,
      mesage: "Apertura de caja Exitosa",
      data: caja,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener caja actual:", error);
    handleHttpError(res, "Error al caja actual", 500);
  }
};

/**
 * Abrir caja
 */
const abrirCaja = async (req, res = response) => {
  const transaction = await sequelize.transaction();
  try {
    const { monto_inicial, observaciones } = req.body;
    const usuario_id = req.usuario.id; // Asume middleware de autenticación

    // Limpiar los datos
    const body = matchedData(req);

    // Verificar si hay una caja abierta
    const cajaAbierta = await Cajas.findOne({
      where: { estado: "abierta" },
    });

    if (cajaAbierta) {
      await transaction.rollback();
      handleErrorResponse(res, "Ya existe una caja abierta", 400);
      return;
    }

    // Aperturar Caja
    const nuevaCaja = await Cajas.create(
      {
        fecha_apertura: new Date(),
        monto_inicial,
        usuario_apertura: usuario_id,
        observaciones_apertura: observaciones,
        estado: "abierta",
      },
      { transaction }
    );

    // Crear movimiento de apertura
    await MovimientoCaja.create(
      {
        caja: nuevaCaja.id,
        tipo: "apertura",
        concepto: "Apertura de caja",
        descripcion: observaciones || "Apertura inicial de caja",
        monto: monto_inicial,
        usuario_id,
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
          attributes: ["id", "nombre", "email"],
        },
      ],
    });

    const data = {
      succes: true,
      message: "Apertura de caja Exitosa",
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
    const { caja_id, monto_final, observaciones } = req.body;
    const usuario_id = req.usuario.id;

    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Buscar caja
    const caja = await Caja.findByPk(caja_id);

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
      where: { caja_id },
    });

    const total_ingresos = movimientos
      .filter((m) => m.tipo === "ingreso")
      .reduce((sum, m) => sum + parseFloat(m.monto), 0);

    const total_egresos = movimientos
      .filter((m) => m.tipo === "egreso")
      .reduce((sum, m) => sum + parseFloat(m.monto), 0);

    const saldo_esperado =
      parseFloat(caja.monto_inicial) + total_ingresos - total_egresos;
    const diferencia = parseFloat(monto_final) - saldo_esperado;

    // Actualizar caja
    await caja.update(
      {
        fecha_cierre: new Date(),
        monto_final,
        total_ingresos,
        total_egresos,
        saldo_esperado,
        diferencia,
        estado: "cerrada",
        usuario_cierre: usuario_id,
        observaciones_cierre: observaciones,
      },
      { transaction }
    );

    // Crear movimiento de cierre
    await MovimientoCaja.create(
      {
        caja_id,
        tipo: "cierre",
        concepto: "Cierre de caja",
        descripcion:
          observaciones ||
          `Cierre de caja - Diferencia: Q ${diferencia.toFixed(2)}`,
        monto: monto_final,
        usuario_id,
      },
      { transaction }
    );

    await transaction.commit();

    // Obtener caja actualizada
    const cajaCerrada = await Caja.findByPk(caja_id, {
      include: [
        {
          model: Usuario,
          as: "usuarioApertura",
          attributes: ["id", "nombre"],
        },
        {
          model: Usuario,
          as: "usuarioCierre",
          attributes: ["id", "nombre"],
        },
      ],
    });

    // Generar respuesta exitosa
    const data = {
      succes: true,
      message: "Cierre de caja Exitoso",
      data: cajaCerrada,
    };

    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al cerrar caja:", error);
    // Error al editar categoria
    handleHttpError(res, "Error al cerrar caja");
  }
};

/**
 * Crear movimiento de caja
 */

const crearMovimiento = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { tipo, concepto, descripcion, monto, referencia } = req.body;
    const usuario_id = req.usuario.id;

    // Verificar que hay una caja abierta
    const cajaAbierta = await Caja.findOne({
      where: { estado: "abierta" },
    });

    if (!cajaAbierta) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "No hay caja abierta. Debe abrir una caja primero.",
      });
    }

    // Crear movimiento
    const movimiento = await MovimientoCaja.create(
      {
        caja_id: cajaAbierta.id,
        tipo,
        concepto,
        descripcion,
        monto,
        referencia,
        usuario_id,
      },
      { transaction }
    );

    // Actualizar totales de la caja
    if (tipo === "ingreso") {
      await cajaAbierta.increment("total_ingresos", {
        by: parseFloat(monto),
        transaction,
      });
    } else if (tipo === "egreso") {
      await cajaAbierta.increment("total_egresos", {
        by: parseFloat(monto),
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

    res.status(201).json({
      success: true,
      message: "Movimiento registrado exitosamente",
      data: movimientoCreado,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear movimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar el movimiento",
      error: error.message,
    });
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
      whereClause.created_at = {
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
          attributes: ["id", "nombre"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    res.status(200).json({
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
    });
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los movimientos",
      error: error.message,
    });
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
          attributes: ["id", "nombre"],
        },
        {
          model: Usuario,
          as: "usuarioCierre",
          attributes: ["id", "nombre"],
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
    res.status(500).json({
      success: false,
      message: "Error al obtener el historial de cajas",
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      data: cajas[0],
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las estadísticas",
      error: error.message,
    });
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
