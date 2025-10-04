const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarCompra = [
  check("proveedor").exists().notEmpty(),
  check("usuario").exists().notEmpty(),
  check("apertura").exists().notEmpty(),
  check("detalle").exists().notEmpty(),

  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarCompra };
