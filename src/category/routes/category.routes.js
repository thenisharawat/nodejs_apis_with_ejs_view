const express = require('express');
const categoryRouter = express.Router();
const { addCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController } = require('../controllers/category.controller');

categoryRouter.post('/add-category', addCategoryController)

categoryRouter.get('/category', getAllCategoriesController);

categoryRouter.get('/all-categories', getCategoryByIdController);

categoryRouter.post('/edit-Category', updateCategoryController);

categoryRouter.post('/deleteCategory', deleteCategoryController);

module.exports = categoryRouter;