const { Router } = require("express");

const { validarMedida } = require("../validators/medidas");
const {
  createMedida,
  getMedidas,
  getMedida,
  deleteMedida,
  updateMedida,
} = require("../controllers/medidas");

const router = Router();

// Crear un nueva medida
router.post("/new", validarMedida, createMedida);

// Listar Medidas creadas
router.get("/", getMedidas);

// Ver Medida seleccionada
router.get("/:id", getMedida);

// Eliminar Medida seleccionada
router.delete("/eliminar/:id", deleteMedida);

// Editar Medidaegoria seleccionada
router.put("/editar/:id", validarMedida, updateMedida);

module.exports = router;
