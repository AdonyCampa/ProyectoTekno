const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarModulo = [
  check("nombre")
    .exists()
    .notEmpty()
    .withMessage("El modulo del rol es obligatorio")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),
  check("slug")
    .exists()
    .notEmpty()
    .withMessage("El slug es obligatorio")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El slug debe tener entre 3 y 50 caracteres")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  check("descripcion").optional().trim(),
  check("icono")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("El icono no puede exceder 50 caracteres"),

  check("ruta")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("La ruta no puede exceder 100 caracteres"),

  check("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número entero positivo"),

  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarModuloUpdate = [
  param("id").isInt({ min: 1 }).withMessage("ID de módulo inválido"),

  check("nombre")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),

  check("slug")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El slug debe tener entre 3 y 50 caracteres")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),

  check("descripcion").optional().trim(),

  check("icono")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("El icono no puede exceder 50 caracteres"),

  check("ruta")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("La ruta no puede exceder 100 caracteres"),

  check("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número entero positivo"),

  check("estado")
    .optional()
    .isIn(["activo", "inactivo"])
    .withMessage("Estado inválido"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarModulo, validarModuloUpdate };
