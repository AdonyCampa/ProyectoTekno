const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarVenta = [
  body("cliente_id").isInt({ min: 1 }),
  body("tipo_pago").isIn(["efectivo", "tarjeta", "credito", "transferencia"]),
  body("observaciones").optional().trim(),
  body("detalles").isArray({ min: 1 }),
  body("detalles.*.producto_id").isInt({ min: 1 }),
  body("detalles.*.cantidad").isInt({ min: 1 }),
  body("detalles.*.precio_unitario").isDecimal({ decimal_digits: "0,2" }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarAnularVenta = [
  param("id").isInt({ min: 1 }),
  check("motivo").optional().trim(),

  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarVenta, validarAnularVenta };
