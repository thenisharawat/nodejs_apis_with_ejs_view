const express = require('express');
const indexRouter = express.Router();

indexRouter.get('/', async (req, res, next) => {
    res.render("index", { title: "Home" });
});

indexRouter.get('/about', async (req, res, next) => {
    res.render("about", { title: "About us" });
});

indexRouter.get('/contact', async (req, res, next) => {
    res.render('contact', { title: "Contact us" });
});

module.exports = indexRouter;