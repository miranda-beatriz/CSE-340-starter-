const invModel = require("../models/inventory-model.js");
const utilities = require("../utilities/index");
const pool = require("../database");

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

module.exports = invCont;
