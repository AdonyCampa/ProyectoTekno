const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarUsuario = [
  check("usuario").exists().notEmpty().trim().isLength({ min: 3, max: 10 }),
  check("nombres").exists().notEmpty().trim().isLength({ min: 3, max: 100 }),
  check("apellidos").exists().notEmpty().trim().isLength({ min: 3, max: 100 }),
  check("password").exists().notEmpty().isLength({ min: 6 }),
  check("repeatpassword").exists().notEmpty().isLength({ min: 6 }),
  check("estado").exists().notEmpty().isIn(["activo", "inactivo"]),
  check("imagen").optional().trim(),
  check("rol_id").exists().notEmpty().isInt({ min: 1 }),
  check("email").optional().isEmail().normalizeEmail(),
  check("telefono").optional().trim().isLength({ max: 20 }),
  check("direccion").optional().trim(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarUsuarioUpdate = [
  param("id").isInt({ min: 1 }),
  check("usuario").optional().trim().isLength({ min: 3, max: 10 }),
  check("nombres").optional().trim().isLength({ min: 3, max: 100 }),
  check("apellidos").optional().trim().isLength({ min: 3, max: 100 }),
  check("password").optional().isLength({ min: 6 }),
  check("estado").optional().isIn(["activo", "inactivo"]),
  check("imagen").optional(),
  check("rol_id").optional().isInt({ min: 1 }),
  check("email").optional().isEmail().normalizeEmail(),
  check("telefono").optional().trim().isLength({ max: 20 }),
  check("direccion").optional().trim(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];
const validarPasswordUsuario = [
  param("id").isInt({ min: 1 }),
  check("newpassword").exists().notEmpty().isLength({ min: 6 }),
  check("repeatpassword").exists().notEmpty().isLength({ min: 6 }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  validarUsuario,
  validarUsuarioUpdate,
  validarPasswordUsuario,
};
