const express = require('express');

const invModel = require("../models/inventory-model.js");
const utilities = require("../utilities/index");
const pool = require("../database");
const router = express.Router();

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next({ status: 500, message: "Erro ao buscar inventário por classificação." });
  }
};

/* ***************************
 *  Get vehicle detail by inv_id
 * ************************** */
invCont.getVehicleById = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  try {
    const data = await invModel.getVehicleById(inv_id);
    
    if (data) {
      let nav = await utilities.getNav(); // Caso esteja usando navegação dinâmica
      res.render("inventory/vehicle_detail", {  // Ajuste aqui
        title: `${data.inv_make} ${data.inv_model}`, 
        vehicle: data,
        nav
      });
    } else {
      next({ status: 404, message: "Veículo não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar veículo: " + error);
    next({ status: 500, message: "Erro no servidor." });
  }
};

/* ***************************
 *  Render Management Page
 * ************************** */
invCont.renderManagementPage = async function (req, res, next) {
  try {
    const nav = await utilities.getNav(); 
    const classificationSelect = await utilities.buildClassificationList();

    res.render("inventory/management", {
  
      title: "New Car Management",
      nav, 
      messages: [], 
      grid: "" 
    });
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  Render Add Classification Page
 * ************************** */
invCont.renderAddClassificationPage = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();

    const messages = req.flash ? req.flash("messages") : []; 

    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages, 
    });
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  Render Add Inventory Page
 * ************************** */
invCont.renderAddInventoryPage = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const messages = req.flash ? req.flash("messages") : []; 
    const classificationList = (await invModel.getClassifications()).rows;

    // Passando valores padrão (vazios) para evitar erros na view
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      messages,
      classificationList,
      inv_make: "", // Define um valor padrão vazio
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: ""
    });
  } catch (err) {
    next(err);
  }
};

invCont.addInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification } = req.body;

  console.log("Valores informados: " , classification);

  try {
      const result = await pool.query(
          'INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification]
      );

      console.log('Vehicle added:', result.rows[0]);
      req.flash('success', 'Vehicle added successfully!');
      res.redirect('/inventory/list');
  } catch (error) {
      console.error('Error adding inventory:', error);
      req.flash('error', 'Error adding vehicle. Please try again.');
      res.redirect('/inventory/add-inventory');
  }
};
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

const renderEditInventoryPage = async (req, res) => {
  try {
      const inventoryId = req.params.inventory_id;
      const vehicle = await getVehicleById(inventoryId);

      if (!vehicle) {
          return res.status(404).render("error", { message: "Vehicle not found." });
      }

      res.render("editInventory", { vehicle });
  } catch (error) {
      console.error("Error loading edit page:", error);
      res.status(500).render("error", { message: "Internal server error." });
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
module.exports = invCont;
