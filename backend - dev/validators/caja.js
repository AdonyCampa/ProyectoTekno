const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarApertura = [
  check("monto_inicial")
    .notEmpty()
    .withMessage("El monto inicial es obligatorio")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El monto debe ser un número decimal válido")
    .custom((value) => parseFloat(value) >= 0)
    .withMessage("El monto inicial debe ser mayor o igual a 0"),
  check("observaciones")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las observaciones no pueden exceder 500 caracteres"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarCierre = [
  check("caja")
    .notEmpty()
    .withMessage("El ID de la caja es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero válido"),

  check("monto_final")
    .notEmpty()
    .withMessage("El monto final es obligatorio")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El monto debe ser un número decimal válido")
    .custom((value) => parseFloat(value) >= 0)
    .withMessage("El monto final debe ser mayor o igual a 0"),

  check("observaciones")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las observaciones no pueden exceder 500 caracteres"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarMovimiento = [
  check("tipo")
    .notEmpty()
    .withMessage("El tipo de movimiento es obligatorio")
    .isIn(["ingreso", "egreso"])
    .withMessage('El tipo debe ser "ingreso" o "egreso"'),

  check("concepto")
    .notEmpty()
    .withMessage("El concepto es obligatorio")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El concepto debe tener entre 3 y 100 caracteres"),

  check("monto")
    .notEmpty()
    .withMessage("El monto es obligatorio")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El monto debe ser un número decimal válido")
    .custom((value) => parseFloat(value) > 0)
    .withMessage("El monto debe ser mayor a 0"),

  check("descripcion")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),

  check("referencia")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("La referencia no puede exceder 50 caracteres"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarApertura, validarCierre, validarMovimiento };
