//const { ObjectId } = require('bson');

const mongoose = require('mongoose');

// Define Contact schema
const contactSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
});

// Create the contact Model
const contactModel = mongoose.model('Contact', contactSchema);

// function to save Contact
const saveContact = async (body) => {
    let Contact = contactModel(body);
    let saveContact = Contact.save();
    return saveContact;
}


module.exports = { contactModel, saveContact };
