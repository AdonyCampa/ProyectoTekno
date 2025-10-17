const { check, param } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarProducto = [
  check("codigo").exists().notEmpty().trim().isLength({ min: 1, max: 50 }),
  check("nombre").exists().notEmpty().trim().isLength({ min: 3, max: 150 }),
  check("descripcion").optional().trim(),
  check("precio_costo").isDecimal({ decimal_digits: "0,2" }),
  check("precio_venta").isDecimal({ decimal_digits: "0,2" }),
  check("stock_actual").optional().isInt({ min: 0 }),
  check("stock_minimo").optional().isInt({ min: 0 }),
  check("stock_maximo").optional().isInt({ min: 1 }),
  check("categoria_id").isInt({ min: 1 }),
  check("marca_id").isInt({ min: 1 }),
  check("medida_id").isInt({ min: 1 }),
  check("imagen").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validarProductoUpdate = [
  param("id").isInt({ min: 1 }),
  check("codigo").optional().trim().isLength({ min: 1, max: 50 }),
  check("nombre").optional().trim().isLength({ min: 3, max: 150 }),
  check("descripcion").optional().trim(),
  check("precio_costo").optional().isDecimal({ decimal_digits: "0,2" }),
  check("precio_venta").optional().isDecimal({ decimal_digits: "0,2" }),
  check("stock_actual").optional().isInt({ min: 0 }),
  check("stock_minimo").optional().isInt({ min: 0 }),
  check("stock_maximo").optional().isInt({ min: 1 }),
  check("categoria_id").optional().isInt({ min: 1 }),
  check("marca_id").optional().isInt({ min: 1 }),
  check("medida_id").optional().isInt({ min: 1 }),
  check("imagen").optional().trim(),
  check("estado").optional().isIn(["activo", "inactivo"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validarProducto, validarProductoUpdate };
