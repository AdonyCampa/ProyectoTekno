const { Router } = require("express");

const { validarProveedor } = require("../validators/proveedores");
const {
  createProveedor,
  getProveedores,
  getProveedor,
  deleteProveedor,
  updateProveedor,
} = require("../controllers/proveedores");

const router = Router();

// Crear un nueva Proveedor
router.post("/new", validarProveedor, createProveedor);

// Listar Proveedors creadas
router.get("/", getProveedores);

// Ver Proveedor seleccionada
router.get("/:id", getProveedor);

// Eliminar Proveedor seleccionada
router.delete("/eliminar/:id", deleteProveedor);

// Editar Proveedoregoria seleccionada
router.put("/editar/:id", validarProveedor, updateProveedor);

module.exports = router;
