const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarConvenio = [
    check("motivo").exists().notEmpty(),
    check("total_pago").exists().notEmpty(),
    check("cant_pagos").exists().notEmpty(),
    check("fecha").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


module.exports = { validarConvenio }