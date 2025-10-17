const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarMedida = [
  check("nombre").exists().notEmpty().trim().isLength({ min: 2, max: 50 }),
  check("abreviatura").exists().notEmpty().trim().isLength({ min: 1, max: 10 }),
  check("descripcion").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarMedidaUpdate = [
  param("id").isInt({ min: 1 }),
  check("nombre").optional().trim().isLength({ min: 2, max: 50 }),
  check("abreviatura").optional().trim().isLength({ min: 1, max: 10 }),
  check("descripcion").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarMedida, validarMedidaUpdate };
