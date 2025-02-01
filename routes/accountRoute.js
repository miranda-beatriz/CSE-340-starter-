const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

router.get("/my-account", accountController.handleMyAccount, utilities.errorHandler);

module.exports = router;