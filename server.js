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
const app = express();
const staticRoutes = require("./routes/static");

/* *********
 * Middleware for Static Files
 *********/
app.use(express.static("public")); // Serve static files from the 'public' directory

/* *********
 * View Engine and Templates
 *********/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Not at views root

/* *********
 * Routes
 *********/
app.use(staticRoutes);

// Index route
app.get("/", function (req, res) {
  res.render("index", { title: "Home" });
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