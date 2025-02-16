const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(), 
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(), 
  utilities.handleErrors(async (req, res) => {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    // Fetch user data from the database
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password; // Remove password before generating token

        // Generate JWT
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

        // Set JWT cookie
        res.cookie("jwt", accessToken, {
          httpOnly: true, // Prevent access via JavaScript in the browser
          secure: process.env.NODE_ENV !== "development", // Only allow in HTTPS if not in development
          sameSite: "Lax",
          maxAge: 3600 * 1000, // Expires in 1 hour
        });

        return res.redirect("/account/");
      } else {
        req.flash("notice", "Invalid email or password.");
        return res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error("Access Forbidden");
    }
  })
);

router.get("/dashboard", accountController.getDashboard);

module.exports = router;
