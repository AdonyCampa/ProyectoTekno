const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarProveedor = [
  check("empresa").exists().notEmpty(),
  check("contacto").exists().notEmpty(),
  check("telefono").exists().notEmpty(),
  check("correo").optional(),
  check("direccion").optional(),
  check("estado").exists().notEmpty(),
  check("descripcion").optional(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarProveedor };
