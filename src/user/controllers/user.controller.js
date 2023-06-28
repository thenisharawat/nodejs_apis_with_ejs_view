const express = require('express');
const userModel = require('../models/user.model');
const multer = require('multer');
const upload = multer({ dest: '/uploads' });
const fs = require('fs');
const path = require('path');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const nodemailer = require('nodemailer');
const { ADMIN_EMAIL, ADMIN_EMAIL_PASSWORD } = process.env;

// // Configure Nodemailer with Gmail SMTP settings
// const transporter = nodemailer.createTransport({
//     service: 'smtp.office365.com',
//     port: 587,
//     secure: true, // Set to true if using a secure connection (e.g., with SSL/TLS)
//     // Encryption method: "STARTTLS",
//     auth: {
//         user: ADMIN_EMAIL,
//         pass: ADMIN_EMAIL_PASSWORD
//     }
// });

// Generates a random string
const { generate } = require('otp-generator');


// const parentPath = path.resolve(__dirname, "../../../")
// const uploadsPath = path.join(parentPath, '/public/uploads')


    // Controller for user registration
const registerController = async (req, res, next) => {
    try {
        let Body = req.body;
        // To check if file is available or not in req
        if (req.file) {
            Body.profile_pic = req.file.filename;
        }

        const oneTimePassword = generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        // Assigning the role in the Body object
        Body.role = "user";

        Body.status = "Active";

        const salt = genSaltSync(10);
        const hashedPassword = hashSync(Body.password, salt);

        Body.password = hashedPassword;

        Body.account_verified = false;
        Body.otp = oneTimePassword;

        // sending the verification email
        console.log(`<h3>Dear ${Body.full_name}, Welcome to the Drool!</h3>

                    <p>Please verify your account to continue using the Drool services.</p>
                    <p><b>Your OTP is: </b>${oneTimePassword}</p><br>

                    <b>Regards,</b>
                    <h3>Drools</h3>`);


        // const mailOptions = {
        //     from: ADMIN_EMAIL,
        //     to: Body.email,
        //     subject: 'Drool Account Verification!',
        //     text: `<h3>Dear ${Body.full_name}, Welcome to the Drool!</h3>

        //             <p>Please verify your account to continue using the Drool services.</p>
        //             <p><b>Your OTP is: </b>${oneTimePassword}</p><br>

        //             <b>Regards,</b>
        //             <h3>Drools</h3>`
        // };
        // let flag = false;
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log('Error:', error);
        //         return res.send('An error occurred while sending the email.');
        //     } else {
        //         console.log('Email sent:', info.response);
        //         flag = true;
        //     }
        // });
        // if (flag) {
        let saveResult = await userModel.registerUser(Body);

        if (saveResult) {
            let otpVerify = 'Verify account using otp!';
            let title = 'Verify Account';
            let emailValue = Body.email;
            res.render("otp", { title, otpVerify, emailValue });
            // res.redirect("/user/login");
        }
        else {
            let notRegister = 'Registration unsuccessful!';
            let title = 'Register';
            res.render("register", { title, notRegister });
        }
        // }
    }
    catch (error) {
        res.send(`<h2>Something went wrong, Please try again later: ${error.message}</h2>`);
    }
}

    // Controller for OTP verification

const verifyOtp = async (req, res, next) => {
    try {
        let Body = req.body;
        console.log("verifyOtp Body:-", Body);
        let loginResult = await userModel.loginUser(Body);
        console.log("loginResult:-", loginResult);

        if (loginResult) {

            if (loginResult.otp === Body.otp) {
                let updateResult = await userModel.verifyOtpMethod(loginResult._id);
                console.log("updateResult:-", updateResult);
                if (updateResult.modifiedCount > 0) {
                    res.redirect("/user/login");
                }
                else {
                    let otpVerify = 'Something went wrong, please try again!';
                    let emailValue = Body.email;
                    let title = 'Verify Account';
                    res.render("otp", { title, otpVerify, emailValue });
                }
            }
            else {
                let otpVerify = 'Invalid otp, please enter a valid otp!';
                let emailValue = Body.email;
                let title = 'Verify Account';
                res.render("otp", { title, otpVerify, emailValue });
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

   // Controller for user login

const loginController = async (req, res, next) => {
    try {
        let Body = req.body;

        let loginResult = await userModel.loginUser(Body);

        if (loginResult) {
            if (loginResult.account_verified) {

                const isPasswordMatch = compareSync(Body.password, loginResult.password);
                if (isPasswordMatch) {
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
                let otpVerify = 'Account is not verified, Please check your email and verify you account!';
                let emailValue = Body.email;
                let title = 'Verify Account';
                res.render("otp", { title, otpVerify, emailValue });
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

// Controller for user profile page

const profileController = async (req, res, next) => {
    try {
        let sessions = req.session;
        let userId = sessions.userId;
        let profileResult = await userModel.getProfile(userId);
        let userName = sessions.userName;
        let title = `Profile | ${userName}`;
        let loggedIn = sessions?.loggedIn || false;
        let profilePic = profileResult.profile_pic;
        // const filePath = `${uploadsPath}\\${profilePic}`;
        // const fileExists = fs.existsSync(filePath);

        res.render('profile', { title: title, userName: userName, user: profileResult, loggedIn: loggedIn, profile: profilePic });
    }
    catch (error) {
        res.send(`<h2>Something went wrong, Please try again later: ${error}</h2>`);
    }
}

// Controller for updating  user profile

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

module.exports = { registerController, loginController, profileController, updateProfileController, verifyOtp };