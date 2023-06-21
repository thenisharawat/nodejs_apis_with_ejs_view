const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const admiSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    mobile_number: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
    profile_pic: {
        type: String,
        default: 'default_pic.png'
    }
});


const adminModel = mongoose.model('admin', admiSchema);


const registerAdmin = async (body) => {
    let user = adminModel(body);
    let saveResult = user.save();
    return saveResult;
}

const loginAdmin = async (body) => {
    let query = { email: (body.email).toString() };
    let findResult = adminModel.findOne(query);
    return findResult;
}

const findAdmin = async (body) => {
    let query = { email: (body.email).toString() };
    let findResult = adminModel.findOne(query);
    return findResult;
}

const getProfile = async (userId) => {
    let query = { _id: userId };
    let findResult = adminModel.findOne(query);
    return findResult;
}

const updateProfile = async (body) => {
    let query = { _id: body.userId };
    let setData = {
        full_name: body.full_name,
        email: body.email,
        mobile_number: body.mobile_number,
        profile_pic: body.profile_pic
    };
    let updateResult = adminModel.updateOne(query, setData);
    return updateResult;
}

module.exports = { adminModel, registerAdmin, loginAdmin, getProfile, updateProfile, findAdmin };













