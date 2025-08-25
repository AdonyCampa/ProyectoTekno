const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarContrato = [
    check("no_contrato").exists().notEmpty(),
    check("no_acuerdo").exists().notEmpty(),
    check("id_plaza").exists().notEmpty(),
    check("fecha_acuerdo").exists().notEmpty(),
    check("fecha_contrato").exists().notEmpty(),
    check("fecha_posesion").exists().notEmpty(),
    check("fecha_fin").exists().notEmpty(),
    check("sueldo").exists().notEmpty(),
    check("id_expediente").exists().notEmpty(),
    check("estado").optional(),
    check("descripcion").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


module.exports = { validarContrato };