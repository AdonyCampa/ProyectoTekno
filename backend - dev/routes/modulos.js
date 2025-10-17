const { Router } = require("express");

const {
  getModulos,
  getModuloById,
  createModulo,
  updateModulo,
  deleteModulo,
  inicializarModulos,
} = require("../controllers/modulos");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const { validarModulo, validarModuloUpdate } = require("../validators/modulos");

const router = Router();

// Aplicar middleware de autenticación
router.use(validarJWT);

/**
 * @route   GET /api/modulos
 * @desc    Obtener todos los módulos
 * @access  Private
 */
router.get("/", getModulos);

/**
 * @route   GET /api/modulos/:id
 * @desc    Obtener módulo por ID
 * @access  Private
 */
router.get("/:id", getModuloById);

/**
 * @route   POST /api/modulos
 * @desc    Crear nuevo módulo
 * @access  Private (requiere permisos de roles)
 */
router.post(
  "/",
  validarPermisos("roles", "crear"),
  validarModulo,
  createModulo
);

/**
 * @route   PUT /api/modulos/:id
 * @desc    Actualizar módulo
 * @access  Private
 */
router.put(
  "/:id",
  validarPermisos("roles", "actualizar"),
  validarModuloUpdate,
  updateModulo
);

/**
 * @route   DELETE /api/modulos/:id
 * @desc    Eliminar módulo
 * @access  Private
 */
router.delete("/:id", validarPermisos("roles", "eliminar"), deleteModulo);

/**
 * @route   POST /api/modulos/inicializar
 * @desc    Inicializar módulos del sistema
 * @access  Private
 */
router.post(
  "/inicializar",
  validarPermisos("roles", "crear"),
  inicializarModulos
);

module.exports = router;
