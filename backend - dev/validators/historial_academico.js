const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarHistorialAcademico = [
    check("id_nivel").exists().notEmpty(),
    check("establecimiento").exists().notEmpty(),
    check("titulo").exists().notEmpty(),
    check("fecha").exists().notEmpty(),
    check("id_expediente").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


module.exports = { validarHistorialAcademico }