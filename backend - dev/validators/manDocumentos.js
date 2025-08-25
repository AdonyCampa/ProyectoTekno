const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarNivelAcademico = [
    check("nombre").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


const validarRequisito = [
    check("nombre").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarTipoDoc = [
    check("nombre").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

module.exports = { validarNivelAcademico, validarRequisito, validarTipoDoc }