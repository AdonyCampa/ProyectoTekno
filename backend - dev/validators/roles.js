const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarRol = [
  check("nombre")
    .exists()
    .notEmpty()
    .withMessage("El nombre del rol es obligatorio")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),
  check("descripcion").optional().trim(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarRolUpdate = [
  param("id").isInt({ min: 1 }).withMessage("ID de rol inválido"),
  check("nombre")
    .exists()
    .notEmpty()
    .withMessage("El nombre del rol es obligatorio")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),
  check("descripcion").optional().trim(),
  check("estado")
    .optional()
    .isIn(["activo", "inactivo"])
    .withMessage("Estado inválido"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarAsignarPermisos = [
  param("rol_id").isInt({ min: 1 }).withMessage("ID de rol inválido"),

  check("permisos")
    .isArray({ min: 1 })
    .withMessage("Debe proporcionar al menos un permiso"),

  check("permisos.*.modulo_id")
    .isInt({ min: 1 })
    .withMessage("ID de módulo inválido"),

  check("permisos.*.crear")
    .optional()
    .isBoolean()
    .withMessage("El campo crear debe ser booleano"),

  check("permisos.*.leer")
    .optional()
    .isBoolean()
    .withMessage("El campo leer debe ser booleano"),

  check("permisos.*.actualizar")
    .optional()
    .isBoolean()
    .withMessage("El campo actualizar debe ser booleano"),

  check("permisos.*.eliminar")
    .optional()
    .isBoolean()
    .withMessage("El campo eliminar debe ser booleano"),
];

module.exports = { validarRol, validarRolUpdate, validarAsignarPermisos };
