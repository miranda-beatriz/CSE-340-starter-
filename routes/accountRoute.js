const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const registerController = require("../controllers/registerController");
const regValidate = require('../utilities/account-validation');
const accountController = require("../controllers/accountController");


router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  registerController
);



// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )
  
module.exports = router;

