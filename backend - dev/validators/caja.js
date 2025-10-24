const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarApertura = [
  check("monto_inicial")
    .exists()
    .notEmpty()
    .isDecimal({ decimal_digits: "0,2" })
    .custom((value) => parseFloat(value) >= 0),
  check("observaciones").optional().trim().isLength({ max: 500 }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarCierre = [
  check("caja_id").exists().notEmpty().isInt({ min: 1 }),
  check("monto_final")
    .exists()
    .notEmpty()
    .isDecimal({ decimal_digits: "0,2" })
    .custom((value) => parseFloat(value) >= 0),
  check("observaciones").optional().trim().isLength({ max: 500 }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarMovimiento = [
  check("tipo").exists().notEmpty().isIn(["ingreso", "egreso"]),
  check("concepto").exists().notEmpty().trim().isLength({ min: 3, max: 100 }),
  check("monto")
    .exists()
    .notEmpty()
    .isDecimal({ decimal_digits: "0,2" })
    .custom((value) => parseFloat(value) > 0),
  check("descripcion").optional().trim().isLength({ max: 500 }),
  check("referencia").optional().trim().isLength({ max: 50 }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarApertura, validarCierre, validarMovimiento };
