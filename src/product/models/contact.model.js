const mongoose = require('mongoose');
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

const contactModel = mongoose.model('Contact', contactSchema);
const saveContact = async (body) => {
    let Contact = contactModel(body);
    let saveContact = Contact.save();
    return saveContact;
}

module.exports = { contactModel, saveContact };
