const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

router.get("/account", accountController.handleMyAccount, utilities.errorHandler);

module.exports = router;