const { Router } = require("express");

const {
  validarProducto,
  validarProductoUpdate,
} = require("../validators/productos");
const {
  createProducto,
  getProductos,
  deleteProducto,
  updateProducto,
  getProductosBajoStock,
  getProductoById,
  eliminarImagenProducto,
  subirImagenProducto,
} = require("../controllers/productos");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");
const {
  uploadProductoImage,
  handleMulterError,
} = require("../middlewares/upload");

const router = Router();

router.use(validarJWT);

// Listar Productos creados
router.get("/", validarPermisos("productos", "leer"), getProductos);

router.get(
  "/bajo-stock",
  validarPermisos("productos", "leer"),
  getProductosBajoStock
);

// Ver Producto seleccionado
router.get("/:id", validarPermisos("productos", "leer"), getProductoById);

// Crear un nuevo Producto
router.post(
  "/",
  validarPermisos("productos", "crear"),
  validarProducto,
  createProducto
);

// Editar Productoegoria seleccionado
router.put(
  "/:id",
  validarPermisos("productos", "actualizar"),
  validarProductoUpdate,
  updateProducto
);

// Eliminar Producto seleccionado
router.delete("/:id", validarPermisos("productos", "eliminar"), deleteProducto);

/**
 * @route POST /api/productos/:id/imagen
 * @desc Subir imagen de producto
 * @access Private
 */
router.post(
  "/:id/imagen",
  validarPermisos("productos", "actualizar"),
  uploadProductoImage,
  handleMulterError,
  subirImagenProducto
);

/**
 * @route DELETE /api/productos/:id/imagen
 * @desc Eliminar imagen de producto
 * @access Private
 */
router.delete(
  "/:id/imagen",
  validarPermisos("productos", "actualizar"),
  eliminarImagenProducto
);

module.exports = router;
