const express = require('express');
const contactModel = require('../models/contact.model');
const path = require('path');

// Controller  for handling contact
const contactController = async (req, res, next) => {
    try {
        let Body = req.body;
        console.log("Body:-", req.body);

        let saveResult = await contactModel.saveContact(Body);
        console.log("saveResult:-", saveResult);

        if (saveResult) {
            res.redirect("/");
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