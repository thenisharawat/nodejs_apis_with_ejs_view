//const { ObjectId } = require('bson');

const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});

// Create the newsletter model
const newsletterModel = mongoose.model('newsletter', newsletterSchema);

// Function to save a newsletter 
const saveNewsletter = async (body) => {
    let Contact = newsletterModel(body);
    return Contact.save();
};

module.exports = { newsletterModel, saveNewsletter };
