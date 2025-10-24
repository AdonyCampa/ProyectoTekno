const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarRol = [
  check("nombre").exists().notEmpty().trim().isLength({ min: 3, max: 50 }),
  check("descripcion").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarRolUpdate = [
  param("id").isInt({ min: 1 }),
  check("nombre").optional().trim().isLength({ min: 3, max: 50 }),
  check("descripcion").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarAsignarPermisos = [
  param("rol_id").isInt({ min: 1 }),
  check("permisos").isArray({ min: 1 }),
  check("permisos.*.modulo_id").isInt({ min: 1 }),
  check("permisos.*.crear").optional().isBoolean(),
  check("permisos.*.leer").optional().isBoolean(),
  check("permisos.*.actualizar").optional().isBoolean(),
  check("permisos.*.eliminar").optional().isBoolean(),
];

module.exports = { validarRol, validarRolUpdate, validarAsignarPermisos };
