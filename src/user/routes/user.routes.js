const express = require('express');
const multer = require('multer');
const userRouter = express.Router();
const app = express();
const { registerController, loginController, profileController, updateProfileController, verifyOtp, googleLoginRegisterController } = require('../controllers/user.controller');
const { contactController } = require('../controllers/contact.controller');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { isAuth } = require('../../utils/session');
const { newsletterController } = require('../controllers/newsletter.controller');

const {
    CLIENT_ID,
    CLIENT_SECRET
} = process.env;

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


passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: '/user/auth/google/callback',
    scope: ['email', 'profile'] // Include the 'profile' scope
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    done(null, id);
});


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
    failureRedirect: '/user/auth/google',
    // successRedirect: '/profile',
}), googleLoginRegisterController);


// Render the login page to the user
userRouter.get('/login', async (req, res, next) => {
    res.render('login', { title: 'Login' });
});

// Render the login page to the user
userRouter.post('/verify-otp', verifyOtp);

// User login route
userRouter.post('/login', loginController);

// User logout using destroy session
userRouter.get('/logout', (req, res) => {
    // Clear session data
    req.session.destroy((error) => {
        if (error) {
            res.send(`<h2>Something went wrong: ${error}</h2>`);
        } else {
            // Redirect to the login page or any other desired page
            res.redirect('/user/login');
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
