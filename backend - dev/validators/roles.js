const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");

const validarRol = [
    check("rol").exists().notEmpty(),
    check("descripcion").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    },
];

module.exports = { validarRol };