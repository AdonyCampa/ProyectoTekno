const { Router } = require("express");

const { validarMedida, validarMedidaUpdate } = require("../validators/medidas");
const {
  createMedida,
  getMedidas,
  deleteMedida,
  updateMedida,
  getMedidaById,
} = require("../controllers/medidas");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const router = Router();

router.use(validarJWT);

// Listar Medidas creadas
router.get("/", validarPermisos("medidas", "leer"), getMedidas);

// Ver Medida seleccionada
router.get("/:id", validarPermisos("medidas", "leer"), getMedidaById);

// Crear un nueva medida
router.post(
  "/",
  validarPermisos("medidas", "crear"),
  validarMedida,
  createMedida
);

// Editar Medidaegoria seleccionada
router.put(
  "/:id",
  validarPermisos("medidas", "actualizar"),
  validarMedidaUpdate,
  updateMedida
);

// Eliminar Medida seleccionada
router.delete("/:id", validarPermisos("medidas", "eliminar"), deleteMedida);

module.exports = router;
