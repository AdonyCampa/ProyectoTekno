const { Router } = require('express');
const { check } = require('express-validator');
const { loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarLogin } = require('../validators/auth');


const router = Router();

// Login de usuario
router.post( '/login', validarLogin, loginUsuario );

// Validar y revalidar token
router.get( '/renew', validarJWT , revalidarToken );







module.exports = router;