const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarMarca = [
  check("marca").exists().notEmpty(),
  check("estado").exists().notEmpty(),
  check("descripcion").optional(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarMarca };
