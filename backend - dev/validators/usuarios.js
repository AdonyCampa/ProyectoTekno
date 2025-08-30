const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarUsuario = [
    check("usuario").exists().notEmpty(),
    check("nombres").exists().notEmpty(),
    check("apellidos").exists().notEmpty(),
    check("password").exists().notEmpty(),
    check("estado").exists().notEmpty(),
    check("rol").exists().notEmpty(),
    check("correo").optional(),
    check("direccion").optional(),
    check("dpi").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];
const validarPasswordUsuario = [
    check("newpassword").exists().notEmpty(),
    check("repeatpassword").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

module.exports = { validarUsuario, validarPasswordUsuario }