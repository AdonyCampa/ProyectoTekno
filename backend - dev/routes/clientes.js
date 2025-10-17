const { Router } = require("express");

const {
  validarCliente,
  validarClienteUpdate,
} = require("../validators/clientes");
const {
  createCliente,
  getClientes,
  deleteCliente,
  updateCliente,
  getClienteById,
} = require("../controllers/clientes");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const router = Router();

router.use(validarJWT);

// Listar Clientes creados
router.get("/", validarPermisos("clientes", "leer"), getClientes);

// Ver Cliente seleccionado
router.get("/:id", validarPermisos("clientes", "leer"), getClienteById);

// Crear un nuevo Cliente
router.post(
  "/",
  validarPermisos("clientes", "crear"),
  validarCliente,
  createCliente
);

// Editar Clienteegoria seleccionado
router.put(
  "/:id",
  validarPermisos("clientes", "actualizar"),
  validarClienteUpdate,
  updateCliente
);

// Eliminar Cliente seleccionado
router.delete("/:id", validarPermisos("clientes", "eliminar"), deleteCliente);

module.exports = router;
