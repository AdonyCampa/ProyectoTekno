const { Router } = require("express");

const {
  getReporteInventario,
  getProductosBajoStock,
  getMovimientosProducto,
  ajustarInventario,
  getValorInventario,
  getAlertasInventario,
} = require("../controllers/inventarios");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarPermisos } = require("../middlewares/validar-permisos");
const { validarInventario } = require("../validators/inventarios");

const router = Router();

router.use(validarJWT);

router.get(
  "/reporte",
  validarPermisos("inventario", "leer"),
  getReporteInventario
);
router.get(
  "/bajo-stock",
  validarPermisos("inventario", "leer"),
  getProductosBajoStock
);
router.get("/valor", validarPermisos("inventario", "leer"), getValorInventario);
router.get(
  "/alertas",
  validarPermisos("inventario", "leer"),
  getAlertasInventario
);
router.get(
  "/movimientos/:producto_id",
  validarPermisos("inventario", "leer"),
  getMovimientosProducto
);

router.post(
  "/ajustar",
  validarPermisos("inventario", "actualizar"),
  validarInventario,
  ajustarInventario
);

module.exports = router;
