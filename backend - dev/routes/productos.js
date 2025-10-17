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
} = require("../controllers/productos");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

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

module.exports = router;
