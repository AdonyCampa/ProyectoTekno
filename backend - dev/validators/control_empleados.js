const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarAusencia = [
    check("id_empleado").exists().notEmpty(),
    check("justificacion").exists().notEmpty(),
    check("fecha").exists().notEmpty(),
    check("descripcion").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarTardanza = [
    check("id_empleado").exists().notEmpty(),
    check("mes_a").exists().notEmpty(),
    check("tiempo_acumulado").exists().notEmpty(),
    check("descripcion").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarVacaciones = [
    check("id_empleado").exists().notEmpty(),
    check("cant_dias").exists().notEmpty(),
    check("fecha_inicio").exists().notEmpty(),
    check("fecha_fin").exists().notEmpty(),
    check("descripcion").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

module.exports = { validarAusencia, validarTardanza, validarVacaciones }