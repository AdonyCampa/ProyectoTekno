const { Router } = require("express");

const {
  validarProveedor,
  validarProveedorUpdate,
} = require("../validators/proveedores");
const {
  createProveedor,
  getProveedores,
  deleteProveedor,
  updateProveedor,
  getProveedorById,
} = require("../controllers/proveedores");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const router = Router();

router.use(validarJWT);

// Listar Proveedors creadas
router.get("/", validarPermisos("proveedores", "leer"), getProveedores);

// Ver Proveedor seleccionada
router.get("/:id", validarPermisos("proveedores", "leer"), getProveedorById);

// Crear un nueva Proveedor
router.post(
  "/",
  validarPermisos("proveedores", "crear"),
  validarProveedor,
  createProveedor
);

// Editar Proveedoregoria seleccionada
router.put(
  "/editar/:id",
  validarPermisos("proveedores", "actualizar"),
  validarProveedorUpdate,
  updateProveedor
);

// Eliminar Proveedor seleccionada
router.delete(
  "/:id",
  validarPermisos("proveedores", "eliminar"),
  deleteProveedor
);

module.exports = router;
