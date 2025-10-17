const { Router } = require("express");
const {
  validarCategoria,
  validarCategoriaUpdate,
} = require("../validators/categorias");
const {
  getCategorias,
  getCategoriaById,
  createCategoria,
  deleteCategoria,
  updateCategoria,
} = require("../controllers/categorias");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const router = Router();

router.use(validarJWT);

// Listar categorias creadas
router.get("/", validarPermisos("categorias", "leer"), getCategorias);

// Ver categoria seleccionada
router.get("/:id", validarPermisos("categorias", "leer"), getCategoriaById);

// Crear un nueva categoria
router.post(
  "/",
  validarPermisos("categorias", "crear"),
  validarCategoria,
  createCategoria
);

// Editar categoria seleccionada
router.put(
  "/editar/:id",
  validarPermisos("categorias", "actualizar"),
  validarCategoriaUpdate,
  updateCategoria
);

// Eliminar categoria seleccionada
router.delete(
  "/eliminar/:id",
  validarPermisos("categorias", "eliminar"),
  deleteCategoria
);

module.exports = router;
