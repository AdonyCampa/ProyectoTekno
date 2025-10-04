const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarApertura = [
  check("usuario").exists().notEmpty(),
  check("monto_inicial").exists().notEmpty(),

  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarCierre = [
  check("monto_final").exists().notEmpty(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarMovimiento = [
  check("apertura").exists().notEmpty(),
  check("asunto").exists().notEmpty(),
  check("concepto").exists().notEmpty(),
  check("monto").exists().notEmpty(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarApertura, validarCierre, validarMovimiento };
