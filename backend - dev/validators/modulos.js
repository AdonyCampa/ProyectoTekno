const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarModulo = [
  check("nombre").exists().notEmpty().trim().isLength({ min: 3, max: 50 }),
  check("slug")
    .exists()
    .notEmpty()
    .trim()
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-z0-9-]+$/),
  check("descripcion").optional().trim(),
  check("icono").optional().trim().isLength({ max: 50 }),
  check("ruta").optional().trim().isLength({ max: 100 }),
  check("orden").optional().isInt({ min: 0 }),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarModuloUpdate = [
  param("id").isInt({ min: 1 }),
  check("nombre").optional().trim().isLength({ min: 3, max: 50 }),
  check("slug")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-z0-9-]+$/),
  check("descripcion").optional().trim(),
  check("icono").optional().trim().isLength({ max: 50 }),
  check("ruta").optional().trim().isLength({ max: 100 }),
  check("orden").optional().isInt({ min: 0 }),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarModulo, validarModuloUpdate };
