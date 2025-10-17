const { Router } = require("express");

const { validarCompra, validarAnularCompra } = require("../validators/compras");
const {
  registrarCompra,
  getCompras,
  anularCompra,
  getEstadisticasCompras,
  getCompraById,
} = require("../controllers/compras");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");

const router = Router();

router.use(validarJWT);

// Listar Compras
router.get("/", validarPermisos("compras", "leer"), getCompras);
router.get(
  "/estadisticas",
  validarPermisos("compras", "leer"),
  getEstadisticasCompras
);

// Ver detalle de compra
router.get("/:id", validarPermisos("compras", "leer"), getCompraById);

// Registrar nueva comra
router.post(
  "/",
  validarPermisos("compras", "crear"),
  validarCompra,
  registrarCompra
);

// Eliminar compra seleccionada
router.post(
  "/:id/anular",
  validarPermisos("compras", "eliminar"),
  validarAnularCompra,
  anularCompra
);

module.exports = router;
