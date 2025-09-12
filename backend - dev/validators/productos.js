const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarProducto = [
    check("producto").exists().notEmpty(),
    check("stockmin").exists().notEmpty(),
    check("stockmax").exists().notEmpty(),
    check("categoria").exists().notEmpty(),
    check("marca").exists().notEmpty(),
    check("descripcion").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    },
];

module.exports = { validarProducto };