const express = require('express');
const productModel = require('../models/product.model');
//const userModel = require('../../user/models/user.model');
const { ObjectId } = require('mongodb');
const path = require('path');

// const parentPath = path.resolve(__dirname, "../../../");
// const uploadsPath = path.join(parentPath, '/public/uploads');

const createProductController = async (req, res) => {
    try {
        let Body = req.body;
        // if (req.file) {
        Body.category_id = new ObjectId(Body.category_id);

        let saveResult = await productModel.createProduct(Body);
        if (saveResult) {
        //    return res.render('addProduct', { title: 'Add New Product'});
            //return res.status(200).json({ message: 'Create product successfully' });
        } else {
            return res.status(400).json({ message: ' Could not Create product successfully' });
        }

        // }

    } catch (error) {
        console.error('catch error:', error);
        return res.status(500).send({ error: 'Something went wrong' });
    }
}

const getAllProductsController = async (req, res) => {
    try {
        let Body = req.body;
        const findProduct = await productModel.getAllProducts(Body);
        if (findProduct) {
            return res.status(200).json({ message: 'get all product successfully' });
        } else {
            return res.status(404).json({ message: 'Not get ' });
        }
    } catch (error) {
        console.error("Catch error:-", error);
        return res.status(500).send({ message: 'Something went wrong', data: error });
    }
}


const getProductByIdController = async (req, res, next) => {
    try {
        let Body = req.params.id;
        let product = await productModel.getProductById(Body);
        if (product) {
            return res.status(404).json({ message: 'Product find successfully' });
        } else {
            res.status(200).json({ message: ' product  not find successfully' });
        }
    } catch (error) {
        console.error('Catch:', error);
        return res.status(500).send({ message: 'Something went wrong', data: error });
    }
};

const updateProductController = async (req, res, next) => {
    try {
        let Body = req.body;
        let productUpdate = await productModel.updateProduct(Body);
        if (productUpdate) {
            return res.status(200).json({ message: 'update product successfully' });
        } else {
            res.status(200).json({ message: 'product  could not  updated  successfully' });
        }
    } catch (error) {
        console.error('Catch:', error);
        return res.status(500).send({ message: 'Something went wrong', data: error });
    }
}


const deleteProductController = async (req, res, next) => {
    try {
        let Body = req.params.id;
        let productDelete = await productModel.deleteProduct(Body);
        if (productDelete) {
            return res.status(200).json({ message: '  deleted product successfully' });
        }
        return res.status(404).json({ error: 'Product could not deleted successfully ' });

    } catch (error) {
        console.error('Catch:', error);
        return res.status(500).send({ error: 'Something went wrong' });
    }
};

module.exports = { createProductController, getAllProductsController, getProductByIdController, updateProductController, deleteProductController };