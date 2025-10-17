const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarProveedor = [
  check("empresa").exists().notEmpty().trim().isLength({ min: 3, max: 100 }),
  check("contacto").optional().trim().isLength({ max: 100 }),
  check("nit").optional().trim().isLength({ max: 20 }),
  check("telefono").optional().trim().isLength({ max: 20 }),
  check("email").optional().isEmail().normalizeEmail(),
  check("direccion").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarProveedorUpdate = [
  param("id").isInt({ min: 1 }),
  check("empresa").optional().trim().isLength({ min: 3, max: 100 }),
  check("contacto").optional().trim().isLength({ max: 100 }),
  check("nit").optional().trim().isLength({ max: 20 }),
  check("telefono").optional().trim().isLength({ max: 20 }),
  check("email").optional().isEmail().normalizeEmail(),
  check("direccion").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarProveedor, validarProveedorUpdate };
