const express = require('express');
const userModel = require('../models/user.model');

const registerController = async (req, res, next) => {

    try {
        let Body = req.body;

        let saveResult = await userModel.registerUser(Body);

        if (saveResult) {
            res.redirect("/user/login");
        }
        else {
            let notRegister = 'Registration unsuccessful!';
            let title = 'Register';
            res.render("register", { title, notRegister });
        }
    }
    catch (error) {
        res.send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);
    }
}


const loginController = async (req, res, next) => {
    const loginController = async (req, res, next) => {
        try {
            let Body = req.body;

            let loginResult = await userModel.loginUser(Body);

            if (loginResult) {
                if (loginResult.password === (Body.password).toString()) {
                    res.send(`<h2>Logged in successfully</h2>`);
                }
                else {
                    let notLogin = 'Invalid password!';
                    let title = 'Login';
                    res.render("login", { title, notLogin });
                }
            }
            else {
                let notLogin = 'Account not found!';
                let title = 'Login';
                res.render("login", { title, notLogin });
            }
        }
        catch (error) {
            res.send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);
        }
    }
}

    module.exports = { registerController, loginController };