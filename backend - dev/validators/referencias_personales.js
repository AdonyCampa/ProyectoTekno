const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarReferenciaPersonal = [
    check("nombres").exists().notEmpty(),
    check("ocupacion").exists().notEmpty(),
    check("telefono").exists().notEmpty(),
    check("id_expediente").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


module.exports = { validarReferenciaPersonal }