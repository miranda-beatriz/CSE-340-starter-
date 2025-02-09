
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:inv_id", invController.getVehicleById);

router.get("/force-error", errorController.generateError);

router.get("/add-inventory", invController.buildAddInventory);


module.exports = router;