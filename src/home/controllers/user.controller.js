const express = require('express');
const userModel = require('../models/user.model');
const multer = require('multer');
const upload = multer({ dest: '/public/uploads' });
const fs = require('fs');
const path = require('path');

const parentPath = path.resolve(__dirname, "../../../")
const uploadsPath = path.join(parentPath, '/public/uploads');


const registerController = async (req, res, next) => {
    try {
        let Body = req.body;
        if (req.file) {
            Body.profile_pic = req.file.filename;
        }
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
    try {
        let Body = req.body;

        let loginResult = await userModel.loginUser(Body);

        if (loginResult) {
            if (loginResult.password === (Body.password).toString()) {
                req.session.loggedIn = true;
                req.session.userEmail = loginResult.email;
                req.session.userId = loginResult._id;
                req.session.userName = loginResult.full_name;
                res.redirect("/");
                // res.send(`<h2>Logged in successfully</h2>`);
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

const profileController = async (req, res, next) => {
    try {
        let sessions = req.session;
        let userId = sessions.userId;
        let profileResult = await userModel.getProfile(userId);
        let userName = sessions.userName;
        let title = `Profile | ${userName}`;
        let loggedIn = sessions?.loggedIn || false;
        let profilePic = profileResult.profile_pic;
        const filePath = `${uploadsPath}\\${profilePic}`;
        const fileExists = fs.existsSync(filePath);

        res.render('profile', { title: title, userName: userName, user: profileResult, loggedIn: loggedIn, profile: profilePic, fileExists });
    }
    catch (error) {
        res.send(`<h2>Something went wrong, Please try again later: ${error}</h2>`);
    }
}

const updateProfileController = async (req, res, next) => {
    try {
        let Body = req.body;
        let userId = req.session.userId;
        let profileResult = await userModel.getProfile(userId);
        if (profileResult) {
            Body.userId = userId;
            if (req.file) {
                Body.profile_pic = req.file.filename
            }
            let updateResult = await userModel.updateProfile(Body);
            if (updateResult.modifiedCount > 0) {
                res.redirect("/user/profile");
            }
            else {
                let profilePic = profileResult.profile_pic;
                const filePath = `${uploadsPath}\\${profilePic}`;
                const fileExists = fs.existsSync(filePath);

                let notProfile = 'Update unsuccessful!';
                let title = `Profile |  ${req.session.userName}`;
                res.render("profile", { title, notProfile, userName: req.session.userName, user: profileResult, loggedIn: req.session?.loggedIn || false, profile: profilePic, fileExists });
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

module.exports = { registerController, loginController, profileController, updateProfileController };