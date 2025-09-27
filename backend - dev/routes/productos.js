const { Router } = require("express");

const { validarProducto } = require("../validators/productos");
const {
  createProducto,
  getProductos,
  getProducto,
  deleteProducto,
  updateProducto,
} = require("../controllers/productos");

const router = Router();

// Crear un nuevo Producto
router.post("/new", validarProducto, createProducto);

// Listar Productos creados
router.get("/", getProductos);

// Ver Producto seleccionado
router.get("/:id", getProducto);

// Eliminar Producto seleccionado
router.delete("/eliminar/:id", deleteProducto);

// Editar Productoegoria seleccionado
router.put("/editar/:id", validarProducto, updateProducto);

module.exports = router;
