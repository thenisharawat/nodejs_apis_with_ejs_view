const express = require('express');
const adminModel = require('../models/admin.model');
const userModel = require('../../user/models/user.model');
// const multer = require('multer');
// const upload = multer({ dest: '/public/uploads' });
const fs = require('fs');
const path = require('path');

const { genSaltSync, hashSync, compareSync } = require('bcryptjs');


const {
    ADMIN1_LOGIN,
    ADMIN2_LOGIN,
    ADMIN1_PASSWORD,
    ADMIN2_PASSWORD,
    ADMIN1_MOBILE,
    ADMIN2_MOBILE
} = process.env;

// Register controller for admins
const registerController = async (req, res, next) => {
    try {
        const salt = genSaltSync(12);
        const hashedPassword1 = hashSync(ADMIN1_PASSWORD, salt);
        const hashedPassword2 = hashSync(ADMIN2_PASSWORD, salt);
        let Body = [
            {
                full_name: "Nisha Rawat",
                mobile_number: ADMIN1_MOBILE,
                email: ADMIN1_LOGIN,
                password: hashedPassword1,
                role: "admin"
            },
            {
                full_name: "Krishna Karn",
                mobile_number: ADMIN2_MOBILE,
                email: ADMIN2_LOGIN,
                password: hashedPassword2,
                role: "admin"
            },
        ];

        for (let i = 0; i < Body.length; i++) {
            let findResult = await adminModel.findAdmin(Body[i]);
            if (findResult) {
                console.log("Super admin is already registered!");
            }
            else {
                let saveResult = await adminModel.registerAdmin(Body[i]);
                if (saveResult) {
                    console.log("Super admin is registered successfully!");
                }
                else {
                    console.log("Super admin is not registered successfully!");
                }
            }
        }
        return;
    }
    catch (error) {
        console.error("Catch error:-", error);
        res.status(500).send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);
    }
}


// loginController for admins
const loginController = async (req, res, next) => {
    try {
        let Body = req.body;

        let loginResult = await adminModel.loginAdmin(Body);

        if (loginResult) {
            let matchedPassword = compareSync(Body.password, loginResult.password);
            console.log("matchedPassword:-", matchedPassword);
            if (matchedPassword) {
                req.session.loggedIn = true;
                req.session.userEmail = loginResult.email;
                req.session.userId = loginResult._id;
                req.session.userName = loginResult.full_name;
                res.redirect("/admin/dashboard");
                // res.status(500).send(`<h2>Logged in successfully</h2>`);
            }
            else {
                let notLogin = 'Invalid password!';
                let title = 'Admin Login';
                res.render("adminLogin", { title, notLogin });
            }
        }
        else {
            let notLogin = 'Account not found!';
            let title = 'Admin Login';
            res.render("adminLogin", { title, notLogin });
        }
    }
    catch (error) {
        console.error("Catch error:-", error);
        res.status(500).send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);
    }
}

//dashboardController for admins
const dashboardController = async (req, res, next) => {
    try {
        let allUsers = await userModel.userList();
        res.render('adminDashboard', { title: 'Admin Dashboard', loggedIn: req.session?.loggedIn || false, users: allUsers });
    }
    catch (error) {
        console.error("Catch error:-", error);
        res.status(500).send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);
    }
}

// const profileController = async (req, res, next) => {
//     try {
//         let sessions = req.session;
//         let userId = sessions.userId;
//         let profileResult = await adminModel.getProfile(userId);
//         let userName = sessions.userName;
//         let title = `Profile | ${userName}`;
//         let loggedIn = sessions?.loggedIn || false;
//         let profilePic = profileResult.profile_pic;
//         const filePath = `${uploadsPath}\\${profilePic}`;
//         const fileExists = fs.existsSync(filePath);

//         res.render('profile', { title: title, userName: userName, user: profileResult, loggedIn: loggedIn, profile: profilePic, fileExists });
//     }
//     catch (error) {
//         res.status(500).send(`<h2>Something went wrong, Please try again later: ${error}</h2>`);
//     }
// }

// const updateProfileController = async (req, res, next) => {
//     try {
//         let Body = req.body;
//         let userId = req.session.userId;
//         let profileResult = await adminModel.getProfile(userId);
//         if (profileResult) {
//             Body.userId = userId;
//             if (req.file) {
//                 Body.profile_pic = req.file.filename
//             }
//             let updateResult = await adminModel.updateProfile(Body);
//             if (updateResult.modifiedCount > 0) {
//                 res.redirect("/user/profile");
//             }
//             else {
//                 let profilePic = profileResult.profile_pic;
//                 const filePath = `${uploadsPath}\\${profilePic}`;
//                 const fileExists = fs.existsSync(filePath);

//                 let notProfile = 'Update unsuccessful!';
//                 let title = `Profile |  ${req.session.userName}`;
//                 res.render("profile", { title, notProfile, userName: req.session.userName, user: profileResult, loggedIn: req.session?.loggedIn || false, profile: profilePic, fileExists });
//             }
//         }
//         else {
//             let notLogin = 'Account not found!';
//             let title = 'Login';
//             res.render("login", { title, notLogin });
//         }
//     }
//     catch (error) {
//         res.status(500).send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);
//     }
// }

// Export the controllers
module.exports = {
    registerController,
    loginController,
    dashboardController,
    // profileController,
    // updateProfileController
};