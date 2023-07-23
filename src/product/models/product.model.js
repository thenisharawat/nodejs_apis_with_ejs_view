const mongoose = require('mongoose');
const { ObjectId }= require('mongodb');

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    brand: {
        type: String,
      required: true
    },
    material: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: '/images/default_pic.png'
    },
    category_id: {
        type: ObjectId,
        ref: 'Category'
    }
});

const productModel = mongoose.model('Product', productSchema);


const createProduct = async (body) => {
    let product = productModel(body);
    let saveResult = product.save();
    return saveResult;
}


const getAllProducts = async () => {
    let findProducts = await productModel.find();
    return findProducts;
};


const getProductById = async (productId) => {
    let findProducts = await productModel.findOne(productId);
    return findProducts;
};


const updateProduct = async (body) => {
    let query = { _id: body.productId };
    let setData = {
        product_name: body.product_name,
        email: body.email,
        brand:body.brand,
        size:body.size,
        price: body.price,
        //profile_pic: body.profile_pic
    };
    let updateResult = productModel.updateOne(query, setData);
    return updateResult;
}


const deleteProduct = async (productId) => {
    let deleteProduct = productModel.deleteOne({ _id: productId });
    return deleteProduct;
}


module.exports = { productModel, createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
