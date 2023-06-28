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

module.exports = { userModel, registerUser, loginUser };













