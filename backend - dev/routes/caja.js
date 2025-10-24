const { Router } = require("express");

const {
  getCajaActual,
  abrirCaja,
  cerrarCaja,
  crearMovimiento,
  getMovimientos,
  getHistorialCajas,
  getEstadisticas,
} = require("../controllers/caja");

const {
  validarApertura,
  validarCierre,
  validarMovimiento,
} = require("../validators/caja");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const router = Router();

router.use(validarJWT);

/**
 * @route   GET /api/caja/actual
 * @desc    Obtener caja actual (abierta)
 * @access  Private
 */
router.get("/actual", getCajaActual);

/**
 * @route   POST /api/caja/abrir
 * @desc    Abrir nueva caja
 * @access  Private
 */
router.post("/abrir", validarApertura, abrirCaja);

/**
 * @route   POST /api/caja/cerrar
 * @desc    Cerrar caja actual
 * @access  Private
 */
router.post("/cerrar", validarCierre, cerrarCaja);

/**
 * @route   POST /api/caja/movimiento
 * @desc    Registrar nuevo movimiento
 * @access  Private
 */
router.post("/movimiento", validarMovimiento, crearMovimiento);

/**
 * @route   GET /api/caja/movimientos
 * @desc    Obtener movimientos (con filtros y paginación)
 * @access  Private
 */
router.get("/movimientos", getMovimientos);

/**
 * @route   GET /api/caja/historial
 * @desc    Obtener historial de cajas
 * @access  Private
 */
router.get("/historial", getHistorialCajas);

/**
 * @route   GET /api/caja/estadisticas
 * @desc    Obtener estadísticas de cajas
 * @access  Private
 */
router.get("/estadisticas", getEstadisticas);

module.exports = router;
