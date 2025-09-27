const { Router } = require("express");

const { validarMarca } = require("../validators/marcas");
const {
  createMarca,
  getMarcas,
  getMarca,
  deleteMarca,
  updateMarca,
} = require("../controllers/marcas");

const router = Router();

// Crear un nueva marca
router.post("/new", validarMarca, createMarca);

// Listar Marcas creadas
router.get("/", getMarcas);

// Ver Marca seleccionada
router.get("/:id", getMarca);

// Eliminar Marca seleccionada
router.delete("/eliminar/:id", deleteMarca);

// Editar Marcaegoria seleccionada
router.put("/editar/:id", validarMarca, updateMarca);

module.exports = router;
