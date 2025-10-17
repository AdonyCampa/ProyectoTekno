const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarUsuario = [
  check("usuario")
    .exists()
    .notEmpty()
    .withMessage("El usuario es obligatorio")
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("El usuario debe tener entre 3 y 10 caracteres"),
  check("nombres")
    .exists()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),
  check("apellidos")
    .exists()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El apellido debe tener entre 3 y 100 caracteres"),
  check("password")
    .exists()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  check("repeatpassword")
    .exists()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  check("estado").exists().notEmpty(),
  check("imagen").optional(),
  check("rol_id")
    .exists()
    .notEmpty()
    .withMessage("El rol es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El rol debe ser un número válido"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  check("telefono")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("El teléfono no puede exceder 12 caracteres"),
  ,
  check("direccion").optional().trim(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarUsuarioUpdate = [
  param("id").isInt({ min: 1 }).withMessage("ID de usuario inválido"),

  check("usuario")
    .optional()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("El usuario debe tener entre 3 y 10 caracteres"),
  check("nombres")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),
  check("apellidos")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El apellido debe tener entre 3 y 100 caracteres"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  check("estado")
    .optional()
    .isIn(["activo", "inactivo"])
    .withMessage("Estado inválido"),
  check("imagen").optional(),
  check("rol_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El rol debe ser un número válido"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  check("telefono")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("El teléfono no puede exceder 12 caracteres"),
  ,
  check("direccion").optional().trim(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];
const validarPasswordUsuario = [
  check("newpassword")
    .exists()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  check("repeatpassword")
    .exists()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  validarUsuario,
  validarPasswordUsuario,
  validarUsuarioUpdate,
};
