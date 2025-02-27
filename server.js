/* **************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 ***************/

/* *********
 * Require Statements
 *********/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const path = require('path');
const app = express();
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");
const session = require("express-session");
const pool = require('./database/');
const accountRoute = require('./routes/accountRoute');
const bodyParser = require("body-parser");

/* *********
 * Middleware for Static Files
 *********/
app.use(express.static("public")); // Serve static files from the 'public' directory

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* *********
 * View Engine and Templates
 *********/
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Not at views root

/* *********
 * Routes
 *********/
// Use express.urlencoded() to parse URL-encoded form data
app.use(express.urlencoded({ extended: true })); // Para formularios do tipo application/x-www-form-urlencoded
app.use(bodyParser.json()); // Para JSON, caso esteja enviando como JSON

app.use(staticRoutes);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);
app.use("/error", inventoryRoute);

// Account routes
app.use("/account", require("./routes/accountRoute"));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry and Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  let message;

  const status = err.status || 500; 

  if (status === 404) {
    message = err.message || "Page not found.";
  } else {
    message = err.message || "Oh no! There was a crash. Maybe try a different route?";
  }

  res.status(status).render("errors/error", {
    title: `Error ${status}`,
    message,
    status,
    nav
  });
});

/* *********
 * Local Server Information
 * Values from .env (environment) file
 *********/
const port = process.env.PORT || 3000; // Default to port 3000 if not specified
const host = process.env.HOST || "localhost";

/* *********
 * Log statement to confirm server operation
 *********/
app.listen(port, () => {
  console.log("App listening on http://localhost:5500/");
});
