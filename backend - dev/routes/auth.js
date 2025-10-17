const { Router } = require("express");
const { loginUsuario, revalidarToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");
const { obtenerPermisosUsuario } = require("../middlewares/validar-permisos");
const { validarLogin } = require("../validators/auth");

const router = Router();

// Login de usuario
router.post("/login", validarLogin, loginUsuario);

// Ruta para obtener permisos del usuario autenticado
router.get("/permisos", validarJWT, obtenerPermisosUsuario);

// Validar y revalidar token
router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
