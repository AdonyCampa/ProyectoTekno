const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarPlaza = [
    check("id_plaza").exists().notEmpty(),
    check("descripcion").optional(),
    check("id_renglon").exists().notEmpty(),
    check("id_departamento").exists().notEmpty(),
    check("id_jornada").exists().notEmpty(),

    check("descuentos.*.id").optional(),
    check("descuentos.*.id_descuento").optional(),

    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarPlazaUpdate = [
    check("id_plaza").exists().notEmpty(),
    check("id_renglon").exists().notEmpty(),
    check("id_departamento").exists().notEmpty(),
    check("id_jornada").exists().notEmpty(),
    check("descripcion").optional(),
    
    check("descuentos.*.id").optional(),
    check("descuentos.*.id_descuento").optional(),
    check("descuentos.*.id_plaza").optional(),


    (req, res, next) => {
        return validateResults(req, res, next)
    }
];



module.exports = { validarPlaza, validarPlazaUpdate }