// // Needed Resources 
// const express = require("express")
// const router = new express.Router() 
// const invController = require("../controllers/invController")

// // Route to build inventory by classification view
// router.get("/type/:classificationId", invController.buildByClassificationId);

// module.exports = router;

// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Rota para exibir os detalhes do veículo
router.get("/detail/:inv_id", invController.getVehicleById);

// Rota para gerar um erro 500 intencional
router.get("/force-error", errorController.generateError);

module.exports = router;