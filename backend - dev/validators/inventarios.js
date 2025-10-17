const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarInventario = [
  check("producto_id").isInt({ min: 1 }),
  check("tipo").isIn(["incremento", "decremento"]),
  check("cantidad").isInt({ min: 1 }),
  check("motivo").notEmpty().trim(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarInventario };
