const { Router } = require("express");
const { validarCat } = require("../validators/categorias");
const {
  createCat,
  getCats,
  getCat,
  deleteCat,
  updateCat,
} = require("../controllers/categorias");

const router = Router();

// Crear un nueva categoria
router.post("/new", validarCat, createCat);

// Listar categorias creadas
router.get("/", getCats);

// Ver categoria seleccionada
router.get("/:id", getCat);

// Eliminar categoria seleccionada
router.delete("/eliminar/:id", deleteCat);

// Editar categoria seleccionada
router.put("/editar/:id", validarCat, updateCat);

module.exports = router;
