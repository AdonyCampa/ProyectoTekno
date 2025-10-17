const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarCategoria = [
  check("nombre").exists().notEmpty().trim().isLength({ min: 3, max: 100 }),
  check("estado").optional().isIn(["activo", "inactivo"]),
  check("descripcion").optional().trim(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarCategoriaUpdate = [
  param("id").isInt({ min: 1 }),
  check("nombre").optional().trim().isLength({ min: 3, max: 100 }),
  check("descripcion").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarCategoria, validarCategoriaUpdate };
