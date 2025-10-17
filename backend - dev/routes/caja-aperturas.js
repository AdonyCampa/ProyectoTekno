const { Router } = require("express");

const router = Router();

// Aperturar caja
router.post("/apertura");

// Listar Aperturas
router.get("/");

// Estado
router.get("/status");

// Ver Apertura
router.get("/:id");

// Eliminar Aperturaegoria seleccionada
router.delete("/eliminar/:id");

// Cierre de caja
router.put("/cierre/:id");

module.exports = router;
