const express = require('express');
const multer = require('multer');
const userRouter = express.Router();
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const { registerController, loginController, profileController, updateProfileController, verifyOtp, googleLoginRegisterController, facebookLoginRegisterController, twitterLoginRegisterController } = require('../controllers/user.controller');
const { contactController } = require('../controllers/contact.controller');
const { isAuth, authentication } = require('../../utils/session');
const { newsletterController } = require('../controllers/newsletter.controller');
const userModel = require('../models/user.model');

const {
    G_CLIENT_ID,
    G_CLIENT_SECRET,
    FB_CLIENT_ID,
    FB_CLIENT_SECRET,
    TW_CONSUMER_KEY,
    TW_CONSUMER_SECRET,
} = process.env;

/*** Multer configuration starts ***/

// Configure multer to upload images to the server
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        // Customize the filename if needed
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const originalName = file.originalname.split('.')[0];
        const originalExtension = file.originalname.split('.').pop();
        // Generate a unique filename for the image
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + originalName + '.' + originalExtension);
    }
});

// Set limitations and rules to the multer
const upload = multer({
    storage: Storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        // Accept only certain file types
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG, JPG and PNG files are allowed'));
        }
    }
});

/*** Multer configuration ends ***/

/*** Passport strategy configuration starts ***/

passport.use(new GoogleStrategy({
    clientID: G_CLIENT_ID,
    clientSecret: G_CLIENT_SECRET,
    callbackURL: '/user/auth/google/callback',
    enableProof: true,
    scope: ['email', 'profile'] // Include the 'profile' scope
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

// Configure passport to use Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: FB_CLIENT_ID,
    clientSecret: FB_CLIENT_SECRET,
    callbackURL: '/user/auth/fb/callback',
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)']
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

passport.use(new TwitterStrategy({
    consumerKey: TW_CONSUMER_KEY,
    consumerSecret: TW_CONSUMER_SECRET,
    callbackURL: '/user/auth/twitter/callback'
}, (token, tokenSecret, profile, done) => {
    done(null, profile);
}));

/*** Passport strategy configuration ends ***/


/*** Passport serialize/deserialize starts ***/

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    // Fetch user from the database based on the ID
    let user = await userModel.findUserByGoogleId(id);
    done(null, user);
});

/*** Passport serialize/deserialize ends ***/

/*** User routes starts ***/

// Render the register page to the user
userRouter.get('/register', async (req, res, next) => {
    res.render('register', { title: 'Register' });
});

// Handle registration request from form data submitted by client side
userRouter.post('/register', upload.single('image'), registerController);

// Route for initiating Google authentication
userRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after successful authentication
userRouter.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/user/login',
    // successRedirect: '/profile',
}), googleLoginRegisterController);


// Route for initiating Facebook authentication
// userRouter.get('/auth/fb', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));
userRouter.get('/auth/fb', passport.authenticate('facebook'));

// Callback route after successful authentication
userRouter.get('/auth/fb/callback', passport.authenticate('facebook', {
    failureRedirect: '/user/login',
}), facebookLoginRegisterController);


userRouter.get('/auth/twitter', passport.authenticate('twitter'));

userRouter.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/user/login',
}), twitterLoginRegisterController);


// Render the login page to the user
userRouter.get('/login', authentication, async (req, res, next) => {
    console.log("/login....");
    // if (req.isAuthenticated()) {
    //     return res.redirect('/'); // Redirect to a suitable URL for logged-in users
    // }
    return res.render('login', { title: 'Login' });
});

// Render the login page to the user
userRouter.post('/verify-otp', verifyOtp);

// User login route
userRouter.post('/login', authentication, loginController);

// User logout using destroy session
userRouter.get('/logout', (req, res, next) => {
    console.log("session?.passport:--", req.session?.passport);
    if (req.session?.passport) {
        req.logout((err) => {
            if (err) {
                console.log("err passport:--", err);
                return next(err);
            }
            // Redirect to the login page or any other desired page
        });
        return res.redirect('/');
    }
    // Clear session data
    req.session.destroy((error) => {
        if (error) {
            res.send(`<h2>Something went wrong: ${error}</h2>`);
        } else {
            // Redirect to the login page or any other desired page
            return res.redirect('/');
        }
    });
});

// User profile route
userRouter.get('/profile', isAuth, profileController);

// User update profile route
userRouter.post('/update-profile', isAuth, upload.single('image'), updateProfileController);

// Render the contact page to the user
userRouter.get('/contact', async (req, res, next) => {
    res.render('contact', { title: "Contact us" });
});

// User contact us route
userRouter.post('/contact', contactController);

// User newsletter router
userRouter.post('/newsletter', newsletterController);


module.exports = userRouter;
