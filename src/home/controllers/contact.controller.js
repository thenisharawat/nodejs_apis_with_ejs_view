const express = require('express');
const contactModel = require('../models/contact.model');
const path = require('path');

const contactController = async (req, res, next) => {
    try {
        let Body = req.body;
        console.log("Body:-", req.body);

        let saveResult = await contactModel.saveContact(Body);
        console.log("saveResult:-", saveResult);

        if (saveResult) {
            res.redirect("/contact");
        }
        else {
            let notContact = 'Contact unsuccessful!';
            let title = 'Contact';
            res.render("Contact", { title, notContact });
        }
    }
    catch (error) {
        res.send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);
        
    }
}

module.exports = { contactController };
























/*const contactModel = require('../models/contact.model');

const contactController = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        // Create a new contact document
        const contact = new contactModel({
            name,
            email,
            message
        });

        // Save the contact document to the database
        const savedContact = await contact.save();

        if (savedContact) {
            // Contact details successfully saved
            res.redirect('/user/contact');
        } else {
            // Contact save failed
            res.render('Contact', {
                title: 'Contact',
                notContact: 'Contact unsuccessful!'
            });
        }
    } catch (error) {
        // Handle any errors that occurred during the saving process
        res.render('Contact', {
            title: 'Contact',
            notContact: 'Something went wrong, please try again later!'
        });
    }
};

module.exports = { contactController };



*/





















