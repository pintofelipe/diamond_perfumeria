const express = require("express");
const router = express.Router();
const orderController = require("../controllers/cartController.cjs"); 

router.post("/", orderController.crearOrden);
router.get("/", orderController.obtenerOrdenes);
router.get("/:id", orderController.obtenerOrdenPorId);
router.patch("/:id/status", orderController.actualizarEstadoOrden);
router.delete("/:id", orderController.eliminarOrden);

module.exports = router;