const path = require('path');
const newsletterModel = require('../models/newsletter.model');

// Newsletter controller
const newsletterController = async (req, res, next) => {
    try {
        let Body = req.body;
        console.log("Body:-", req.body);

        let saveResult = await newsletterModel.saveNewsletter(Body);
        console.log("saveResult:-", saveResult);

        if (saveResult) {
            res.redirect("/");
        }
        else {
            let notNewsletter = 'Newsletter unsuccessful!';
            let title = 'Home';
            res.render("Home", { title, notNewsletter });
        }
    }
    catch (error) {
        res.send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);

    }
};

module.exports = { newsletterController };