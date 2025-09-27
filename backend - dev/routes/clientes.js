const { Router } = require("express");

const { validarCliente } = require("../validators/clientes");
const {
  createCliente,
  getClientes,
  getCliente,
  deleteCliente,
  updateCliente,
} = require("../controllers/clientes");

const router = Router();

// Crear un nuevo Cliente
router.post("/new", validarCliente, createCliente);

// Listar Clientes creados
router.get("/", getClientes);

// Ver Cliente seleccionado
router.get("/:id", getCliente);

// Eliminar Cliente seleccionado
router.delete("/eliminar/:id", deleteCliente);

// Editar Clienteegoria seleccionado
router.put("/editar/:id", validarCliente, updateCliente);

module.exports = router;
