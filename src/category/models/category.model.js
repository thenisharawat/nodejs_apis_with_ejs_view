const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,

    },
    category_img: {
        type: String,
        default: 'default_pic.png'
    }

});

const CategoryModel = mongoose.model('Category', categorySchema);

const createCategory = async (body) => {
    let category = CategoryModel(body);
    let saveResult = category.save();
    return saveResult;
}

const getAllCategories = async () => {
    let findCategory = await CategoryModel.find({ name: null });
    return findCategory;
};

const getCategoryById = async (Body) => {
    let findCategory = await CategoryModel.findOne(query);
    return findCategory;
};



const updateCategory = async (body) => {
    let query = { _id: body.categoryId };
    let setData = {
        name: body.name,

    };
    let updateResult = CategoryModel.updateOne(query, setData);
    return updateResult;
}


const deleteCategory = async (categoryId) => {
    let deleteCategory = CategoryModel.deleteOne({ _id: categoryId });
    return deleteCategory;
}


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};