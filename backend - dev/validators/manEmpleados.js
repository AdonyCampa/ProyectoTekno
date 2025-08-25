const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarCatPlaza = [
    check("nombre").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarDepartamento = [
    check("nombre").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarDescuento = [
    check("nombre").exists().notEmpty(),
    check("descuento").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarJornada = [
    check("nombre").exists().notEmpty(),
    check("hora_inicio").exists().notEmpty(),
    check("hora_fin").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarRenglon = [
    check("nombre").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

module.exports = { validarCatPlaza, validarDepartamento, validarDescuento, validarJornada, validarRenglon }