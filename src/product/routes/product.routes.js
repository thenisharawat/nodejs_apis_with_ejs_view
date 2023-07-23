const express = require('express');
const multer = require('multer');
const { createProductController, getAllProductsController, getProductByIdController, updateProductController, deleteProductController } = require('../controllers/product.controller');
const productRouter = express.Router();
const upload = multer({ dest: 'public/uploads/' });

// productRouter.post('/register', upload.single('image'), registerController);

productRouter.post('/add-product', createProductController);

productRouter.get('/products', getAllProductsController);

productRouter.get('/productId', getProductByIdController);

productRouter.post('/updateProduct', upload.single('image'), updateProductController);

productRouter.post('/deleteProduct', deleteProductController);

module.exports = productRouter;



