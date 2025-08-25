const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarArchivo = [
    check("asunto").exists().notEmpty(),
    check("estado").exists().notEmpty(),
    check("cod_ref").exists().notEmpty(),
    check("fecha").exists().notEmpty(),
    check("fecha_recepcion").exists().notEmpty(),
    check("id_tipo").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


module.exports = { validarArchivo }