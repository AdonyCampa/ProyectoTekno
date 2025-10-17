const { Router } = require("express");
const {
  createRol,
  deleteRol,
  updateRol,
  getRoles,
  getRolById,
  asignarPermisos,
  getPermisosPorRol,
} = require("../controllers/roles");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const {
  validarAsignarPermisos,
  validarRol,
  validarRolUpdate,
} = require("../validators/roles");

const router = Router();

// Aplicar middleware de autenticación
router.use(validarJWT);

/**
 * @route   GET /api/roles
 * @desc    Obtener todos los roles
 * @access  Private
 */
router.get("/", validarPermisos("roles", "leer"), getRoles);

/**
 * @route   GET /api/roles/:id
 * @desc    Obtener rol por ID
 * @access  Private
 */
router.get("/:id", validarPermisos("roles", "leer"), getRolById);

/**
 * @route   POST /api/roles
 * @desc    Crear nuevo rol
 * @access  Private
 */
router.post("/", validarPermisos("roles", "crear"), validarRol, createRol);

/**
 * @route   PUT /api/roles/:id
 * @desc    Actualizar rol
 * @access  Private
 */
router.put(
  "/:id",
  validarPermisos("roles", "actualizar"),
  validarRolUpdate,
  updateRol
);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Eliminar rol
 * @access  Private
 */
router.delete("/:id", validarPermisos("roles", "eliminar"), deleteRol);

/**
 * @route   POST /api/roles/:rol_id/permisos
 * @desc    Asignar permisos a un rol
 * @access  Private
 */
router.post(
  "/:rol_id/permisos",
  validarPermisos("roles", "actualizar"),
  validarAsignarPermisos,
  asignarPermisos
);

/**
 * @route   GET /api/roles/:rol_id/permisos
 * @desc    Obtener permisos de un rol
 * @access  Private
 */
router.get(
  "/:rol_id/permisos",
  validarPermisos("roles", "leer"),
  getPermisosPorRol
);

module.exports = router;
