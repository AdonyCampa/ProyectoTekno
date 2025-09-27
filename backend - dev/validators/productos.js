const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarProducto = [
  check("producto").exists().notEmpty(),
  check("stockmin").exists().notEmpty(),
  check("stockmax").exists().notEmpty(),
  check("categoria").exists().notEmpty(),
  check("marca").exists().notEmpty(),
  check("medida").exists().notEmpty(),
  check("precio_venta").exists().notEmpty(),
  check("precio_costo").exists().notEmpty(),
  check("estado").exists().notEmpty(),
  check("imagen").optional(),
  check("descripcion").optional(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarProducto };
