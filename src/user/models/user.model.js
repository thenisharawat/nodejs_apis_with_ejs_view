const { ObjectId } = require('bson');
const mongoose = require('mongoose');

 // Defining user schema
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
    status: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
    account_verified: {
        type: Boolean,
        require: true,
    },
    otp: {
        type: String,
        require: true,
    },
    profile_pic: {
        type: String,
        default: 'default_pic.png'
    }
});

//create the user model

const userModel = mongoose.model('User', userSchema);

 // Function to register a new user
const registerUser = async (body) => {
    let user = userModel(body);
    let saveResult = user.save();
    return saveResult;
}

// Function to login a user
const loginUser = async (body) => {
    let query = { email: (body.email).toString() };
    let findResult = userModel.findOne(query);
    return findResult;
}

  // Function to get user profile
const getProfile = async (userId) => {
    let query = { _id: userId };
    let findResult = userModel.findOne(query);
    return findResult;
}

// Function to update user profile
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

// Function to verify OTP and update account verification status
const verifyOtpMethod = async (body) => {
    let query = { _id: body._id };
    let setData = {
        account_verified: true,
        otp: null
    };
    let updateResult = userModel.updateOne(query, setData);
    return updateResult;
}

// Function to get a list of all users

const userList = async () => {
    let findResult = userModel.find({});
    return findResult;
}

module.exports = { userModel, registerUser, loginUser, getProfile, updateProfile, userList, verifyOtpMethod };













