const { Router } = require("express");
const {
  getUsuarios,
  createUsuario,
  deleteUsuario,
  updateUsuario,
  updatePasswordUsuario,
  eliminarUsuario,
  getUsuarioById,
  eliminarImagenUsuario,
  subirImagenUsuario,
} = require("../controllers/usuarios");

const {
  validarUsuario,
  validarUsuarioUpdate,
  validarPasswordUsuario,
} = require("../validators/usuarios");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");
const {
  uploadUsuarioImage,
  handleMulterError,
} = require("../middlewares/upload");
const router = Router();

// Aplicar middleware de autenticación a las siguientes rutas
router.use(validarJWT);

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios
 * @access  Private (requiere permiso de lectura)
 */
router.get("/", validarPermisos("usuarios", "leer"), getUsuarios);

/**
 * @route   GET /api/usuarios/:id
 * @desc    Obtener usuario por ID
 * @access  Private (requiere permiso de lectura)
 */
router.get("/:id", validarPermisos("usuarios", "leer"), getUsuarioById);

/**
 * @route   POST /api/usuarios
 * @desc    Crear nuevo usuario
 * @access  Private (requiere permiso de creación)
 */
router.post(
  "/",
  validarPermisos("usuarios", "crear"),
  validarUsuario,
  createUsuario
);

/**
 * @route   PUT /api/usuarios/:id
 * @desc    Actualizar usuario
 * @access  Private (requiere permiso de actualización)
 */
router.put(
  "/:id",
  validarPermisos("usuarios", "actualizar"),
  validarUsuarioUpdate,
  updateUsuario
);

/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Eliminar usuario
 * @access  Private (requiere permiso de eliminación)
 */
router.delete("/:id", validarPermisos("usuarios", "eliminar"), eliminarUsuario);

// Eliminar usuario seleccionado
router.delete(
  "/eliminar/:id",
  validarPermisos("usuarios", "eliminar"),
  deleteUsuario
);

/**
 * @route   PUT /api/usuarios/:id/cambiar-password
 * @desc    Cambiar contraseña
 * @access  Private
 */
router.put(
  "/:id/cambiar-password",
  validarPermisos("usuarios", "actualizar"),
  validarPasswordUsuario,
  updatePasswordUsuario
);

// Editar contraseña de usuario seleccionado
router.put(
  "/editarPassword/:id",
  validarPermisos("usuarios", "actualizar"),
  validarPasswordUsuario,
  updatePasswordUsuario
);

/**
 * @route POST /api/usuarios/:id/imagen
 * @desc Subir imagen de usuario
 * @access Private
 */
router.post(
  "/:id/imagen",
  validarPermisos("usuarios", "actualizar"),
  uploadUsuarioImage,
  handleMulterError,
  subirImagenUsuario
);

/**
 * @route DELETE /api/usuarios/:id/imagen
 * @desc Eliminar imagen de usuario
 * @access Private
 */
router.delete(
  "/:id/imagen",
  validarPermisos("usuarios", "actualizar"),
  eliminarImagenUsuario
);

module.exports = router;
