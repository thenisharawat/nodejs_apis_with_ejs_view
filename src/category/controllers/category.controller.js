const express = require('express');
// const productModel = require('../models/product.model');
// const userModel = require('../../user/models/user.model');
const categoryModel = require('../../category/models/category.model');
const path = require('path');



const addCategoryController = async (req, res) => {
    try {
        let Body = req.body;
            let saveResult = await categoryModel.createCategory(Body);
            if (saveResult) {
                return res.status(200).json({ message: 'Category create successfully' });
            } else {
                return res.status(400).json({ message: 'Category could not create unsuccessful' });
            }

    } catch (error) {
        console.error('catch error:', error);
        return res.status(500).send({ error: 'Something went wrong' });
    }
}

const getAllCategoriesController = async (req, res) => {
    try {
        const findProduct = await categoryModel.getAllCategories();
        if (findProduct) {
            return res.status(200).json({ message: 'get all Categories successfully' });
        } else {
            return res.status(404).json({ message: 'Not get ' });
        }

    } catch (error) {
        console.error("Catch error:-", error);
        return res.status(500).send({ message: 'Something went wrong', data: error });
    }
}

const getCategoryByIdController = async (req, res, next) => {
    try {
        let Body = req.params.id;
        let category = await categoryModel.getCategoryById(Body);

        if (category) {
            return res.status(404).json({ error: 'category  find successfully' });
        } else {
            res.status(200).json({ message: ' category  uct  not find successfully' });
        }
    } catch (error) {
        console.error('Catch:', error);
        return res.status(500).send({ message: 'Something went wrong', data: error });
    }
};

const updateCategoryController = async (req, res, next) => {
    try {
        let Body = req.body;
        let categoryUpdate = await categoryModel.updateCategory(Body);
        if (categoryUpdate) {
            return res.status(200).json({ message: 'update category successfully' });
        } else {
            res.status(200).json({ message: 'category  could not  updated  successfully' });
        }
    } catch (error) {
        console.error('Catch:', error);
        return res.status(500).send({ message: 'Something went wrong', data: error });
    }
}


const deleteCategoryController = async (req, res, next) => {
    try {
        let Body = req.params.id;
        let categoryDelete = await categoryModel.deleteCategory(Body);
        if (categoryDelete) {
            return res.status(200).json({ message: '  deleted category successfully' });
        }
        return res.status(404).json({ error: 'category could not deleted successfully ' });

    } catch (error) {
        console.error('Catch:', error);
        return res.status(500).send({ error: 'Something went wrong' });
    }
};


module.exports = { addCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController }
