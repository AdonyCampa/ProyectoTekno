const { Router } = require("express");
const { validarApertura, validarCierre } = require("../validators/caja");

const {
  Apertura,
  getAperturas,
  getApertura,
  deleteApertura,
  Cierre,
  getStatus,
} = require("../controllers/caja");

const router = Router();

// Aperturar caja
router.post("/apertura", validarApertura, Apertura);

// Listar Aperturas
router.get("/", getAperturas);

// Estado
router.get("/status", getStatus);

// Ver Apertura
router.get("/:id", getApertura);

// Eliminar Aperturaegoria seleccionada
router.delete("/eliminar/:id", deleteApertura);

// Cierre de caja
router.put("/cierre/:id", validarCierre, Cierre);

module.exports = router;
