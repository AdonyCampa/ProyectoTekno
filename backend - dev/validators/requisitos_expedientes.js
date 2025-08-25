const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarRequisitoExpediente = [
    check("estado").optional(),
    check("fecha_vencimiento").exists().notEmpty(),
    check("id_requisito").exists().notEmpty(),
    check("id_expediente").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


module.exports = { validarRequisitoExpediente }