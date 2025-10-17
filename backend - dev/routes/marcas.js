const { Router } = require("express");

const { validarMarca, validarMarcaUpdate } = require("../validators/marcas");
const {
  createMarca,
  getMarcas,
  deleteMarca,
  updateMarca,
  getMarcaById,
} = require("../controllers/marcas");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const router = Router();

router.use(validarJWT);

// Listar Marcas creadas
router.get("/", validarPermisos("marcas", "leer"), getMarcas);

// Ver Marca seleccionada
router.get("/:id", validarPermisos("marcas", "leer"), getMarcaById);

// Crear un nueva marca
router.post("/", validarPermisos("marcas", "crear"), validarMarca, createMarca);

// Editar Marca seleccionada
router.put(
  "/:id",
  validarPermisos("marcas", "crear"),
  validarMarcaUpdate,
  updateMarca
);

// Eliminar Marca seleccionada
router.delete("/:id", validarPermisos("marcas", "eliminar"), deleteMarca);

module.exports = router;
