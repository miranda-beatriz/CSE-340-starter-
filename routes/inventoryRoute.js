// Rota para exibir a página "New Car Management"
router.get("/management", invController.renderManagementPage);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Rota para exibir os detalhes do veículo
router.get("/detail/:inv_id", invController.getVehicleById);

// Rota para gerar um erro 500 intencional
router.get("/force-error", errorController.generateError);

// Rota para exibir a página de adicionar nova classificação
router.get("/add-classification", invController.renderAddClassificationPage);

// Rota para exibir a página de adicionar novo item de inventário
router.get("/add-inventory", invController.renderAddInventoryPage);

// Rota POST para processar a inserção no banco
// router.post("/add-inventory", invController.addInventory);

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
], invController.addInventory);  // Usa a função corretamente

module.exports = router;
