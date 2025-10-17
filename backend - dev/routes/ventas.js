const { Router } = require("express");

const { validarCompra, validarAnularCompra } = require("../validators/compras");
const {
  getVentas,
  getVentaById,
  crearVenta,
  cancelarVenta,
  getEstadisticasVentas,
  getReporteVentasDia,
  getProductosMasVendidos,
  registrarVenta,
  anularVenta,
} = require("../controllers/ventas");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");
const { validarVenta, validarAnularVenta } = require("../validators/ventas");

const router = Router();

router.use(validarJWT);

// Listar Compras
router.get("/", validarPermisos("ventas", "leer"), getVentas);
router.get(
  "/estadisticas",
  validarPermisos("ventas", "leer"),
  getEstadisticasVentas
);
router.get(
  "/reporte-dia",
  validarPermisos("ventas", "leer"),
  getReporteVentasDia
);
router.get(
  "/productos-mas-vendidos",
  validarPermisos("ventas", "leer"),
  getProductosMasVendidos
);
router.get("/:id", validarPermisos("ventas", "leer"), getVentaById);

// Registrar nueva venta
router.post(
  "/",
  validarPermisos("ventas", "crear"),
  validarVenta,
  registrarVenta
);

// Eliminar compra seleccionada
router.post(
  "/:id/anular",
  validarPermisos("ventas", "eliminar"),
  validarAnularVenta,
  anularVenta
);

module.exports = router;
