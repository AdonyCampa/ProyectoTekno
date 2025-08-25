const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarHistorialLaboral = [
    check("empresa").exists().notEmpty(),
    check("puesto").exists().notEmpty(),
    check("fecha_inicio").exists().notEmpty(),
    check("fecha_fin").exists().notEmpty(),
    check("id_expediente").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


module.exports = { validarHistorialLaboral }