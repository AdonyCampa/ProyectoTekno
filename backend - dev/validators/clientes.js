const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarCliente = [
  check("nombre").exists().notEmpty(),
  check("nit").optional().trim().isLength({ max: 20 }),
  check("telefono").optional().trim().isLength({ max: 20 }),
  check("email").optional().isEmail().normalizeEmail(),
  check("direccion").optional().trim(),
  check("tipo").optional().isIn(["individual", "empresa"]),
  check("limite_credito").optional().isDecimal({ decimal_digits: "0,2" }),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarClienteUpdate = [
  param("id").isInt({ min: 1 }),
  check("nombre").optional().trim().isLength({ min: 3, max: 100 }),
  check("nit").optional().trim().isLength({ max: 20 }),
  check("telefono").optional().trim().isLength({ max: 20 }),
  check("email").optional().isEmail().normalizeEmail(),
  check("direccion").optional().trim(),
  check("tipo").optional().isIn(["individual", "empresa"]),
  check("limite_credito").optional().isDecimal({ decimal_digits: "0,2" }),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarCliente, validarClienteUpdate };
