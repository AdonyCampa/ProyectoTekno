const { Router } = require("express");

const { validarCompra } = require("../validators/compras");
const {
  registrarCompra,
  getCompras,
  getDetalleCompra,
  deleteCompra,
  anularCompra,
} = require("../controllers/compras");

const router = Router();

// Registrar nueva comra
router.post("/new", validarCompra, registrarCompra);

// Listar Compras
router.get("/", getCompras);

// Ver detalle de compra
router.get("/:id", getDetalleCompra);

// Eliminar compra seleccionada
router.delete("/eliminar/:id", deleteCompra);

// Cierre de caja
router.put("/anular/:id", validarCompra, anularCompra);

module.exports = router;
