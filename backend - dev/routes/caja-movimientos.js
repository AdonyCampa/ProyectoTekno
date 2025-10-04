const { Router } = require("express");
const { validarMovimiento } = require("../validators/caja");

const {
  Movimiento,
  getMovimientos,
  getMovimientosDay,
  deleteMovimiento,
  updateMovimiento,
} = require("../controllers/caja-movimientos");

const router = Router();

// Nuevo movimiento de caja
router.post("/new", validarMovimiento, Movimiento);

// Listar movimientos
router.get("/", getMovimientos);

// Ver movimientos del dia
router.get("/:id", getMovimientosDay);

// Eliminar Aperturaegoria seleccionada
router.delete("/eliminar/:id", deleteMovimiento);

// Cierre de caja
router.put("/editar/:id", validarMovimiento, updateMovimiento);

module.exports = router;
