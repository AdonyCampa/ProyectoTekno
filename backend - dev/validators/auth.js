const { check } = require("express-validator");
const { validateResults } = require("../middlewares/validar-campos");
const validarLogin = [
    check("usuario").exists().notEmpty(),
    check("password").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    },
];


module.exports = { validarLogin };
