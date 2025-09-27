const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarCliente = [
  check("nombres").exists().notEmpty(),
  check("apellidos").exists().notEmpty(),
  check("dpi").optional(),
  check("nit").optional(),
  check("telefono").optional(),
  check("correo").optional(),
  check("direccion").optional(),
  check("estado").exists().notEmpty(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarCliente };
