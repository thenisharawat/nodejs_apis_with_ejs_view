const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    profile_pic: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
    }
});


const userModel = mongoose.model('User', userSchema);


const registerUser = async (body) => {
    let user = userModel(body);
    let saveResult = user.save();
    return saveResult;
}

const loginUser = async (body) => {
    let query = { email: (body.email).toString() };
    let findResult = userModel.findOne(query);
    return findResult;
}

const getProfile = async (userId) => {
    let query = { _id: userId };
    let findResult = userModel.findOne(query);
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
    let updateResult = userModel.updateOne(query, setData);
    return updateResult;
}

module.exports = { userModel, registerUser, loginUser, getProfile, updateProfile };













