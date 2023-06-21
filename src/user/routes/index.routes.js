const express = require('express');
const indexRouter = express.Router();

// This is the home route
indexRouter.get('/', async (req, res, next) => {
    res.render("index", { title: "Home", loggedIn: req.session?.loggedIn || false });
});

// About us page rendering
indexRouter.get('/about', async (req, res, next) => {
    res.render("about", { title: "About us" });
});

// Contact us page rendering
indexRouter.get('/contact', async (req, res, next) => {
    res.render('contact', { title: "Contact us" });
});

module.exports = indexRouter;