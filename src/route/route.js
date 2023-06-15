const express = require('express');
const router = express.Router();
const productController = require('../controller/productController')

router.post("/product", productController.createProduct);
router.get("/product", productController.searchProduct);
router.put("/product/:id", productController.updateProduct);
router.delete("/product/:id", productController.deleteProduct);
router.post("/product/retrieve/:id", productController.retrieveProduct);

module.exports = router;