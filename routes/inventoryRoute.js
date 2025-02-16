const express = require("express");
const { body, validationResult } = require('express-validator');
const router = new express.Router();
const invController = require("../controllers/invController");
const errorController = require("../controllers/errorController");
const utilities = require("../utilities/utilities");

// Route to display the "New Car Management" page
router.get("/management", invController.renderManagementPage);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display vehicle details
router.get("/detail/:inv_id", invController.getVehicleById);

// Route to intentionally generate a 500 error
router.get("/force-error", errorController.generateError);

// Route to display the "Add Classification" page
router.get("/add-classification", invController.renderAddClassificationPage);

// Route to display the "Add Inventory" page
router.get("/add-inventory", invController.renderAddInventoryPage);

// Route to get inventory by classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to display the inventory edit page
router.get("/edit/:inventory_id", utilities.handleErrors(invController.renderEditInventoryPage));

// Route to add new inventory
router.post('/add-inventory', [
    body('classification_id').notEmpty().withMessage('Classification is required'),
    body('inv_make').notEmpty().withMessage('Make is required'),
    body('inv_model').notEmpty().withMessage('Model is required'),
    body('inv_year').isInt({ min: 1886, max: new Date().getFullYear() }).withMessage('Enter a valid year'),
    body('inv_price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('inv_miles').isInt({ min: 0 }).withMessage('Miles must be a non-negative integer'),
    body('inv_color').notEmpty().withMessage('Color is required'),
    body('inv_image').notEmpty().withMessage('Image URL is required'),
    body('inv_thumbnail').notEmpty().withMessage('Thumbnail URL is required')
], invController.addInventory);

// Route to add classification
router.post("/add-classification", async (req, res) => {
    try {
        const { classificationName } = req.body;

        if (!classificationName) {
            return res.status(400).json({ error: "Classification name is required." });
        }

        const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
        await pool.query(sql, [classificationName]);

        res.json({ success: true, message: "Classification added successfully" });
    } catch (error) {
        console.error("Error inserting into database:", error);
        res.status(500).json({ error: "Error entering data into the database." });
    }
});

module.exports = router;
