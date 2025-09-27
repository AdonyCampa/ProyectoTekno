const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarMedida = [
  check("medida").exists().notEmpty(),
  check("abreviatura").exists().notEmpty(),
  check("estado").exists().notEmpty(),
  check("descripcion").optional(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarMedida };
