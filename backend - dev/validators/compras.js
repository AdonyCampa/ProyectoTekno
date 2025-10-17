const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarCompra = [
  check("proveedor_id").isInt({ min: 1 }),
  check("tipo_pago").isIn(["contado", "credito"]),
  check("observaciones").optional().trim(),
  check("detalles").isArray({ min: 1 }),
  check("detalles.*.producto_id").isInt({ min: 1 }),
  check("detalles.*.cantidad").isInt({ min: 1 }),
  check("detalles.*.precio_unitario").isDecimal({ decimal_digits: "0,2" }),

  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarAnularCompra = [
  param("id").isInt({ min: 1 }),
  check("motivo").optional().trim(),

  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarCompra, validarAnularCompra };
